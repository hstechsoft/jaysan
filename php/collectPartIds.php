<?php
function collectPartIds($node, &$partIds)
{
    // Store as key to avoid duplicates
    $partIds[$node['output_part']] = true;

    foreach ($node['children'] as $child) {
        collectPartIds($child, $partIds);
    }
}
 ?>