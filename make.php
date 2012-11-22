<?php

/*
 * X Framework Maker.
 * this is simple php script, to pack all components
 * in the right order and outputs. if the variable $file
 * is passed on the request, then a file  $file.js
 * will be created. and you can use this like preprocessor to.
 */

$xVersion = "1.4 Beta";
$xDate = date(DATE_RSS);
error_reporting(E_ALL ^ E_NOTICE ^ E_WARNING);
$lib_path = dirname(__FILE__) . "/xLib/";
$components = array(
    'xUtils',
    'xCore',
    'xType',
    'xBrowser',
    'xSelector',
    'xJax',
    'xFx',
    'xLib',
    'xEvent',
    'xDrag',
    'xDataSet'
);

$len = sizeof($components);
if (isset($_REQUEST['file']))
    ob_start();

include "LICENSE.x";
for ($i = 0; $i < $len; $i++) {
    if ($_REQUEST['show_names'])
        echo "/*\n * $components[$i]\n */\n";
    else
        echo PHP_EOL;
    include "$lib_path$components[$i].js";
    echo PHP_EOL;
}

header('Content-type: application/x-javascript');
if (isset($_REQUEST['file'])) {
    $ob = ob_get_clean();
    file_put_contents($_REQUEST['file'], $ob);
    echo $ob;
}