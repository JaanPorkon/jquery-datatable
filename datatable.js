(function($)
{
	$.fn.datatable = function(config)
	{
		function naturalSort (a, b) 
		{
			/*
			 * Natural Sort algorithm for Javascript - Version 0.7 - Released under MIT license
			 * Author: Jim Palmer (based on chunking idea from Dave Koelle)
			 * Contributors: Mike Grier (mgrier.com), Clint Priest, Kyle Adams, guillermo
			 * See: http://js-naturalsort.googlecode.com/svn/trunk/naturalSort.js
			 */

			a = a.name;
			b = b.name;

		    var re = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,
		        sre = /(^[ ]*|[ ]*$)/g,
		        dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
		        hre = /^0x[0-9a-f]+$/i,
		        ore = /^0/,
		        // convert all to strings and trim()
		        x = a.toString().replace(sre, '') || '',
		        y = b.toString().replace(sre, '') || '',
		        // chunk/tokenize
		        xN = x.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
		        yN = y.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
		        // numeric, hex or date detection
		        xD = parseInt(x.match(hre), 10) || (xN.length !== 1 && x.match(dre) && Date.parse(x)),
		        yD = parseInt(y.match(hre), 10) || xD && y.match(dre) && Date.parse(y) || null;
		 
		    // first try and sort Hex codes or Dates
		    if (yD) {
		        if ( xD < yD ) {
		            return -1;
		        }
		        else if ( xD > yD ) {
		            return 1;
		        }
		    }
		 
		    // natural sorting through split numeric strings and default strings
		    for(var cLoc=0, numS=Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
		        // find floats not starting with '0', string or 0 if not defined (Clint Priest)
		        var oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc], 10) || xN[cLoc] || 0;
		        var oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc], 10) || yN[cLoc] || 0;
		        // handle numeric vs string comparison - number < string - (Kyle Adams)
		        if (isNaN(oFxNcL) !== isNaN(oFyNcL)) {
		            return (isNaN(oFxNcL)) ? 1 : -1;
		        }
		        // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
		        else if (typeof oFxNcL !== typeof oFyNcL) {
		            oFxNcL += '';
		            oFyNcL += '';
		        }
		        if (oFxNcL < oFyNcL) {
		            return -1;
		        }
		        if (oFxNcL > oFyNcL) {
		            return 1;
		        }
		    }
		    return 0;
		}

		// Merge user configuration changes
		var _config = {
			per_page: 10,
			searchable: false
		};

		for(var attr in config)
		{
			_config[attr] = config[attr];
		}

		// Build datatable structure
		
		var table = $(this);
		var tableParent = $(this).parent();

		var parentDiv = $('<div id="datatable-parent"></div>');
		var headerDiv = $('<div id="datatable-header"></div>');
		var bodyDiv = $('<div id="datatable-body"></div>');
		var footerDiv = $('<div id="datatable-footer"></div>');

		parentDiv.append(headerDiv);
		parentDiv.append(bodyDiv);
		parentDiv.append(footerDiv);

		table.appendTo(bodyDiv);		
		tableParent.append(parentDiv);

		// Add classes to headers
		$.each($(this).find('th'), function(i, header)
		{
			$(header).addClass('datatable-header').attr('sort', 'asc');
		});

		// Listen for header clicks
		table.find('th').click(function()
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
					obj.push({"name": $(name).text(), "value": $(val)});
				}				
			});

			if(sortingWay == '' || sortingWay == 'asc')
			{
				header.attr('sort', 'desc');

				obj.sort(function(a, b)
				{
					return naturalSort(a,b);
				});
			}
			else
			{
				header.attr('sort', 'asc');
				
				obj.sort(function(a, b) {
				    return naturalSort(a,b) * -1;
				});
			}

			tableBody.find('tr').remove();

			for(var row in obj)
			{
				tableBody.append($(obj[row].value));
			}
		});

		if(_config.searchable)
		{
			$('#datatable-header').append($('<div id="datatable-search"><input type="text" id="datatable-search-input" /></div>'));

			$('#datatable-search-input').keyup(function()
			{
				var value = $(this).val();
				console.log(value);

				$.each(table.find('tr'), function(i, row)
				{
					if(i > 0)
					{
						var currentRow = $(row);

						if(value.trim() == '')
						{
							currentRow.show();
						}
						else
						{
							var exists = false;

							currentRow.find('td').each(function(ti, col)
							{
								var contents = $(col).text();
								console.log(value);
								if(contents.search(new RegExp(value, "i")) > -1)
								{
									exists = true;
									return;
								}
							});

							if(!exists)
							{
								currentRow.hide();
							}
						}
					}
				});
			});
		}	
	};
}(jQuery));