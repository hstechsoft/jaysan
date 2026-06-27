<?php

class ProductionPlanner
{
    public $stock = [];
    public $bom = [];
    public $plan = [];
    public $summary = [];

    public function __construct(array $stock, array $bom)
    {
        $this->stock = $stock;
        $this->bom = $bom;
    }

    public function plan($process_id, $required_qty, $level = 1, $parent_process = null,$bom_qty = 1)
    {
        $available = $this->stock[$process_id] ?? 0;

        $used = min($available, $required_qty);

        $remaining = $available - $used;

        $shortage = $required_qty - $used;

        // Update remaining stock
        $this->stock[$process_id] = $remaining;

        // Save planning row
        $this->plan[] = [

            'process_id'     => $process_id,
            'parent_process' => $parent_process,
            'level'          => $level,

            'required_qty'   => $required_qty,

            'stock_before'   => $available,

            'used_qty'       => $used,

            'stock_after'    => $remaining,

            'shortage_qty'   => $shortage,
             'manufacture_qty' => $shortage


        ];

        
        // If enough stock, stop here.
if ($shortage == 0) {
    return;
}

// No child processes
if (!isset($this->bom[$process_id])) {
    return;
}

// Manufacture the shortage only
foreach($this->bom[$process_id] as $child)
{

    $child_required = $shortage * $child['qty'];

    $this->plan(

        $child['child'],

        $child_required,

        $level + 1,

        $process_id,

        $child['qty']

    );

}
    }

    public function getPlan()
    {
        return $this->plan;
    }

    public function getRemainingStock()
    {
        return $this->stock;
    }

    public function getProductionSummary()
{
    $summary = [];

    foreach($this->plan as $row)
    {
        if($row['manufacture_qty'] <= 0)
            continue;

        $process = $row['process_id'];

        if(!isset($summary[$process]))
        {
            $summary[$process] = 0;
        }

        $summary[$process] += $row['manufacture_qty'];
    }

    return $summary;
}


public function buildSummary()
{
    $this->summary = [];

    foreach ($this->plan as $row)
    {
        $process = $row['process_id'];

        if (!isset($this->summary[$process]))
        {
            $this->summary[$process] = [

                'process_id'      => $process,
                'required_qty'    => 0,
                'stock_qty'       => 0,
                'manufacture_qty' => 0,
                'remaining_stock' => 0

            ];
        }

        $this->summary[$process]['required_qty'] += $row['required_qty'];

        $this->summary[$process]['stock_qty'] += $row['used_qty'];

        $this->summary[$process]['manufacture_qty'] += $row['manufacture_qty'];

        // Always keep the latest remaining stock
        $this->summary[$process]['remaining_stock'] = $row['stock_after'];
    }
}
public function getSummary()
{
    return $this->summary;
}
}