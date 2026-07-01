<?php
function collectProcessIds($node, &$processIds)
{
    // Store as key to avoid duplicates
    if (empty($node['output_part']) || $node['output_part'] === '0' || $node['output_part'] === 'NULL') {
        // If output_part is empty, null, or zero, store the process_id
        $processIds[$node['process_id']] = true;
    }

    foreach ($node['children'] as $child) {
        collectProcessIds($child, $processIds);
    }
}
 ?>