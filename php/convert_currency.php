<?php
function numberToIndianCurrency($num)
{
    $ones = array(
        0 => "", 1 => "One", 2 => "Two", 3 => "Three", 4 => "Four",
        5 => "Five", 6 => "Six", 7 => "Seven", 8 => "Eight", 9 => "Nine",
        10 => "Ten", 11 => "Eleven", 12 => "Twelve", 13 => "Thirteen",
        14 => "Fourteen", 15 => "Fifteen", 16 => "Sixteen",
        17 => "Seventeen", 18 => "Eighteen", 19 => "Nineteen"
    );

    $tens = array(
        2 => "Twenty", 3 => "Thirty", 4 => "Forty", 5 => "Fifty",
        6 => "Sixty", 7 => "Seventy", 8 => "Eighty", 9 => "Ninety"
    );

    $convertLessThanThousand = function ($num) use ($ones, $tens) {
        $str = '';

        if ($num >= 100) {
            $str .= $ones[intval($num / 100)] . ' Hundred ';
            $num %= 100;
        }

        if ($num >= 20) {
            $str .= $tens[intval($num / 10)] . ' ';
            $num %= 10;
        }

        if ($num > 0) {
            $str .= $ones[$num] . ' ';
        }

        return trim($str);
    };

    $rupees = floor($num);
    $paise = round(($num - $rupees) * 100);

    $crore = floor($rupees / 10000000);
    $rupees %= 10000000;

    $lakh = floor($rupees / 100000);
    $rupees %= 100000;

    $thousand = floor($rupees / 1000);
    $rupees %= 1000;

    $hundreds = $rupees;

    $result = '';

    if ($crore)
        $result .= $convertLessThanThousand($crore) . ' Crore ';

    if ($lakh)
        $result .= $convertLessThanThousand($lakh) . ' Lakh ';

    if ($thousand)
        $result .= $convertLessThanThousand($thousand) . ' Thousand ';

    if ($hundreds)
        $result .= $convertLessThanThousand($hundreds);

    if ($result == '')
        $result = 'Zero';

    $result .= ' Rupees';

    if ($paise > 0) {
        $result .= ' and ' . $convertLessThanThousand($paise) . ' Paise';
    }

    return trim($result) . ' Only';
}

?>