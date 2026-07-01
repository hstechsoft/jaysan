<?php

function planTree( &$node,
    &$partStock,
    &$processStock,
    &$demandReserve,
    &$demands,
     &$summary)
{
    // -----------------------------------
    // Get Available Stock
    // -----------------------------------

    if (!empty($node['output_part']) && $node['output_part'] > 0) {

        $available = $partStock[$node['output_part']]['total_qty'] ?? 0;

    } else {

        $available = $processStock[$node['process_id']]['total_qty'] ?? 0;

    }

    // -----------------------------------
    // Calculate
    // -----------------------------------

    $consume = min($node['required_qty'], $available);
    $produce = $node['required_qty'] - $consume;

    // -----------------------------------
    // Save Result in Tree
    // -----------------------------------

    $node['stock_qty']   = $available;
    $node['consume_qty'] = $consume;
    $node['produce_qty'] = $produce;

    

    // echo "Process {$node['process_id']} ".
    //      "Need {$node['required_qty']} ".
    //      "Stock {$available} ".
    //      "Consume {$consume} ".
    //      "Produce {$produce}<br>";


         $summary[] = [
    'process_id'   => $node['process_id'],
    'required_qty' => $node['required_qty'],
    'stock_qty'    => $available,
    'consume_qty'  => $consume,
    'produce_qty'  => $produce
];
   // -----------------------------------
    // Collect Demand Reserve
    // -----------------------------------

    if ($consume > 0) {

        $demandReserve[] = [
          
            'process_id' => $node['process_id'],
            'output_part' => $node['output_part'],
            'qty' => $consume
        ];
    }

    // -----------------------------------
    // Collect Production Demand
    // -----------------------------------

    if ($produce > 0) {

        $demands[] = [
         
            'process_id' => $node['process_id'],
            'output_part' => $node['output_part'],
            'qty' => $produce
        ];
    }
    // -----------------------------------
    // Reduce Global Stock
    // -----------------------------------

    if (!empty($node['output_part']) && $node['output_part'] > 0) {

        if (isset($partStock[$node['output_part']])) {
            $partStock[$node['output_part']]['total_qty'] -= $consume;
        }

    } else {

        if (isset($processStock[$node['process_id']])) {
            $processStock[$node['process_id']]['total_qty'] -= $consume;
        }

    }

    // -----------------------------------
    // Nothing more to produce
    // -----------------------------------

    if ($produce <= 0) {
        return;
    }

    // -----------------------------------
    // Plan Children
    // -----------------------------------

    foreach ($node['children'] as &$child) {

        // Child requirement depends on parent's remaining production
        $child['required_qty'] = $produce * $child['bom_qty'];

        planTree($child, $partStock, $processStock, $demandReserve, $demands, $summary);
    }
}