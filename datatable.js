(function($)
{
	$.fn.datatable = function()
	{
		$(this).find('th').click(function()
		{
			var obj = [];
			var header = $(this);
			var cellIndex = header.index();
			var table = header.parent().parent().parent();		
			var tableBody = table.find('tbody');
			var sortingWay = header.attr('sort');

			$.each(table.find('tr'), function(i, val)
			{
				if(i > 0)
				{
					var name = $(val).find('td').eq(cellIndex)[0];
					obj.push({"name": name.innerHTML, "value": $(val)});
				}				
			});

			if(sortingWay == '' || sortingWay == 'asc')
			{
				header.attr('sort', 'desc');

				obj.sort(function(a, b)
				{
					var _a = a.name;
					var _b = b.name;

					if(_a == _b) return 0;

					return (_a > _b) ? 1 : 0;
				});
			}
			else
			{
				header.attr('sort', 'asc');
				
				obj.sort(function(a, b)
				{
					var _a = a.name;
					var _b = b.name;

					if(_a == _b) return 0;

					return (_a < _b) ? 1 : 0;
				});
			}

			tableBody.find('tr').remove();

			for(var row in obj)
			{
				tableBody.append($(obj[row].value));
			}		
		});
	};
}(jQuery));