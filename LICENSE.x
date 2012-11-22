<?php if ($_GET['production']): ?>
/* X Framework <?php echo $xVersion ?> || http://xtinvent.com/x-framework/license*/
<?php else: ?>
/* X Framework <?php echo $xVersion ?> 
* @date <?php echo $xDate . PHP_EOL; ?>
* @license GPL || MIT
* @more http://xtinvent.com/x-framework
*/
<?php
foreach (glob("todo/*.js") as $filename) {
echo PHP_EOL;
include "$filename";
//echo PHP_EOL;
}
?>
<?php endif; ?>
