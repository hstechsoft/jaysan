<?php
// sync_chunk.php
include 'db_head.php';

$filename = __DIR__ . '/../tally/Json/JAStkItem.JSON';
if (!file_exists($filename)) die(json_encode(['error'=>'JSON not found']));

$json = file_get_contents($filename);
$data = json_decode($json, true);
if (!isset($data['StockItem']) || !is_array($data['StockItem'])) {
    die(json_encode(['error'=>'Invalid JSON']));
}

// read start & limit from GET (safe defaults)
$start = isset($_GET['start']) ? (int)$_GET['start'] : 0;
$limit = isset($_GET['limit']) ? max(1, (int)$_GET['limit']) : 200;

// slice items to process in this run
$items = array_slice($data['StockItem'], $start, $limit, true);
$processed = 0;
$log = [];

/* Helper: minimal normalizing & escaping */
function q($s, $conn) {
    return $conn->real_escape_string(trim(str_replace("'", "", (string)$s)));
}

foreach ($items as $idx => $item) {
    $processed++;
    $out_name = isset($item['Name']) ? q($item['Name'], $conn) : '';
    if ($out_name === '') {
        $log[] = ['i'=>$start+$processed-1, 'msg'=>'skip empty name'];
        continue;
    }

    // 1) Ensure output part exists (fast single SELECT)
    $res = $conn->query("SELECT part_id FROM parts_tbl WHERE part_name = '$out_name' LIMIT 1");
    if ($res && $res->num_rows) {
        $r = $res->fetch_assoc();
        $out_id = (int)$r['part_id'];
        $log[] = ['i'=>$start+$processed-1, 'part'=>$out_name, 'status'=>'exist'];
    } else {
        $conn->query("INSERT INTO parts_tbl (part_name) VALUES ('$out_name')");
        $out_id = (int)$conn->insert_id;
        $log[] = ['i'=>$start+$processed-1, 'part'=>$out_name, 'status'=>'inserted'];
    }
    // 2) Process components (if any) - same chunked logic, no heavy arrays
    if (!empty($item['MULTICOMPONENTLIST']) && is_array($item['MULTICOMPONENTLIST'])) {
        foreach ($item['MULTICOMPONENTLIST'] as $component) {
            $cat = isset($component['COMPONENTLISTNAME']) ? q($component['COMPONENTLISTNAME'],$conn) : '';
            if ($cat === '') continue;
            // ensure bom_output exists (single select)
            $rb = $conn->query("SELECT bom_id FROM bom_output WHERE part_id=$out_id AND component_cat='$cat' LIMIT 1");
            if ($rb && $rb->num_rows) {
                $bom = (int)$rb->fetch_assoc()['bom_id'];
            } else {
                $conn->query("INSERT INTO bom_output (part_id, component_cat) VALUES ($out_id, '$cat')");
                $bom = (int)$conn->insert_id;
            }
            // insert inputs
            if (!empty($component['MULTICOMPONENTITEMLIST']) && is_array($component['MULTICOMPONENTITEMLIST'])) {
                foreach ($component['MULTICOMPONENTITEMLIST'] as $citem) {
                    $in_name = q($citem['StockItemName'] ?? '', $conn);
                    $qty = intval(preg_replace('/\D/','', $citem['ACTUALQTY'] ?? '')) ?: 1;
                    if ($in_name === '') continue;
                    // ensure input part exists
                    $ri = $conn->query("SELECT part_id FROM parts_tbl WHERE part_name='$in_name' LIMIT 1");
                    if ($ri && $ri->num_rows) {
                        $in_id = (int)$ri->fetch_assoc()['part_id'];
                    } else {
                        $conn->query("INSERT INTO parts_tbl (part_name) VALUES ('$in_name')");
                        $in_id = (int)$conn->insert_id;
                    }
                    // insert bom_input (no dedupe here; can add UNIQUE index if desired)
                    $conn->query("INSERT INTO bom_input (bom_id, qty, part_id) VALUES ($bom, $qty, $in_id)");
                }
            }
        }
    }
}

// prepare next start
$next = $start + $processed;
$total = count($data['StockItem']);

// return JSON result with progress
header('Content-Type: application/json');
echo json_encode([
    'start'=>$start,
    'processed'=>$processed,
    'next'=> ($next < $total ? $next : null),
    'total'=>$total,
    'log_preview'=> array_slice($log, 0, 10)
]);
$conn->close();
