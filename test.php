<!DOCTYPE HTML>
<html>
<head>
	<meta http-equiv="content-type" content="text/html" />
	<meta charset="UTF-8" /> 
	<style>

	table td,
	table th,
	table {
		border: 1px solid;
	}

	</style>
	<link rel="stylesheet" type="text/css" href="datatable.css" />
</head>

<body>

<?php

$csv = explode('|', file_get_contents("Keyword Planner 2015-12-01 at 21_27_46.csv"));

?>

<table class="datatable">
	<?php

	for($i = 0; $i < count($csv); $i++)
	{
		$row = explode(',', trim($csv[$i]));

		if($i == 0)
		{
			echo '<thead>';
			foreach($row as $columnHeader)
			{
				echo '<th>'.$columnHeader.'</th>';
			}
			echo '</thead>';
		}
		else
		{
			echo '<tr>';
			foreach($row as $columValue)
			{
				echo '<td>'.$columValue.'</td>';
			}
			echo '</tr>';
		}
	}

	?>
</table>

<script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
<script type="text/javascript" src="datatable.js"></script>
<script type="text/javascript">
$(function()
{
	$('.datatable').datatable(
		{
			per_page: 5,
			searchable: true
		});
});

</script>

</body>
</html>