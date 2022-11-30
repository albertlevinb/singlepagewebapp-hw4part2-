// Name: Albert Levin
// Date: 11/29/22

// Additional Sources: https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation#built-in_form_validation_examples

// Makes the first tab active in jQuery
var nextTabId = 1;

function createTable() {
	var firstRow = document.getElementById("firstRow").value;
	var lastRow = document.getElementById("lastRow").value;
	var firstColumn = document.getElementById("firstColumn").value;
	var lastColumn = document.getElementById("lastColumn").value;

	if ($("#multiplicationTableInput").valid()) {
		var table = generateMultiplicationTable(parseInt(firstRow), parseInt(lastRow), parseInt(firstColumn), parseInt(lastColumn));
		createTab(table, generateMultiplicationTableLabel(firstRow, lastRow, firstColumn, lastColumn));
	}
}

// Sources used for the Tabs Widget: https://api.jqueryui.com/tabs/ & https://www.tutorialspoint.com/jqueryui/jqueryui_tabs.htm

// Creates a new tab and places the table object in the new tab's contents (body) area.
function createTab(table, label) {
	var tabId = "tab-" + nextTabId;
	var panelId = "tab-panel-" + nextTabId;

	// Creates a new panel div.
	$("#tabs > div.panelContainer").append("<div id=\"" + panelId + "\"></div>");

	// Deals with the new tab which include the checkboxes
	$("#tabs ul").append("<li id=\"" + tabId + "\"><a href=\"#" + panelId + "\"><div>" + label + "</div></a> <input type=\"checkbox\" class=\"tabCheckBox\"></li>");

	// Allows jQuery to refresh the widget
	$("#tabs").tabs("refresh");

	// Inserts the table into the new panel div.
	$("#" + panelId).empty();
	$("#" + panelId).append($(table));

	++nextTabId;
	selectTab(tabId);

	return panelId;
}

// Delete multiple tabs simultaneously (done through checkboxes)
// Sources: https://stackoverflow.com/questions/1581751/removing-dynamic-jquery-ui-tabs, https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-controls, & https://blog.jqueryui.com/2011/03/tabs-api-redesign/
function deleteSelectedTabs() {
	$("#tabs ul li").each(function() {
		var tabId = $(this).attr("id");
		if ($("#" + tabId + " .tabCheckBox").prop("checked")) {
			var panelId = $(this).remove().attr("aria-controls");
			$("#" + panelId).remove();
			$("#tabs").tabs("refresh");
		}
	});
}

function selectTab(tabId) {
	var index = $("#tabs a[href='#" + tabId + "']").parent().index();
	$("#tabs").tabs("option", "active", index);
}

// Generates a tab label string using the given number range [-50, 50]
function generateMultiplicationTableLabel(firstRow, lastRow, firstColumn, lastColumn) {
	return firstRow + " x " + lastRow + "<br>" + firstColumn + " x " + lastColumn;
}

// Clears the entire table, ensuring the table is out of view (removes all the cells).
function clearTable(table) {
	while (table.rows.length) {
		table.deleteRow(0);
	}
}

// Updates the active tab's table with the current user's input values.
function updateTable() {
	if (!$("#multiplicationTableInput").valid()) {
		return;
	}
	if (!$("#tabs > ul > li").size()) {
		return;
	}

	var firstRow = parseInt($("#firstRow").val());
	var lastRow = parseInt($("#lastRow").val());
	var firstColumn = parseInt($("#firstColumn").val());
	var lastColumn = parseInt($("#lastColumn").val());

	var table = generateMultiplicationTable(firstRow, lastRow, firstColumn, lastColumn);
	var activeTabIndex = $("#tabs").tabs("option", "active");
	var tabId = $("#tabs ul li").eq(activeTabIndex).attr("id");
	var tabIdNumber = tabId.substr(4);
	var panelId = "tab-panel-" + tabIdNumber;

	var label = generateMultiplicationTableLabel(firstRow, lastRow, firstColumn, lastColumn);
	$("#" + tabId + " div").html(label);
	$("#" + panelId).empty();
	$("#" + panelId).append(table);
}

// Creates a table object containing the generated multiplication table using the given number range [-50, 50]
function generateMultiplicationTable(firstRow, lastRow, firstColumn, lastColumn) {
	var multiplicationTable = document.createElement("table");
	clearTable(multiplicationTable);

	var rowCount, reverseRow = false;
	if (lastRow < firstRow) {
		reverseRow = true;
		rowCount = firstRow - lastRow + 1;
	} else {
		rowCount = lastRow - firstRow + 1;
	}

	var columnCount, reverseColumn = false;
	if (lastColumn < firstColumn) {
		reverseColumn = true;
		columnCount = firstColumn - lastColumn + 1;
	} else {
		columnCount = lastColumn - firstColumn + 1;
	}

	var i, j, row, cell;

	row = multiplicationTable.insertRow(0);

	// Leave the top-left cell blank
	row.insertCell(0).innerHTML = "";

	var rowValue, columnValue;

	// Add cells in the top row
	columnValue = firstColumn;
	for (j = 1; j <= columnCount; ++j) {
		row.insertCell(j).innerHTML = columnValue;
		if (reverseColumn)
			--columnValue
		else
			+columnValue;
	}

	// Add cells in the second through last rows
	rowValue = firstRow;
	for (i = 1; i <= rowCount; ++i) {
		row = multiplicationTable.insertRow(i);

		// Add the leftmost cell in the row
		row.insertCell(0).innerHTML = rowValue;

		// Add the other cells in the row
		columnValue = firstColumn;
		for (j = 1; j <= columnCount; ++j) {
			row.insertCell(j).innerHTML = rowValue * columnValue;
			if (reverseColumn)
				--columnValue
			else
				+columnValue;
		}
		if (reverseRow)
			--rowValue
		else
			++rowValue;
	}
	return multiplicationTable;
}

// Creates the new, default table and initializes the rest of the jQuery UI features.
$(window).load(function() {
	var defaultFirstRow = 0;
	var defaultLastRow = 0;
	var defaultFirstColumn = 0;
	var defaultLastColumn = 0;

	// Error handling for floats (decimals) and, if necessary, display an error message afterwards
	// Source: https://jqueryvalidation.org/documentation/
	$.validator.addMethod("integer", function(value, element, param) {
		return !isNaN(value) && Math.floor(value) == value;
	})
	// Describes what rules should be applied to all of the form fields
	$("#multiplicationTableInput").validate({
		rules: {
			firstRow: {
				required: true,
				number: true,
				integer: true,
				range: [-50, 50]
			},
			lastRow: {
				required: true,
				number: true,
				integer: true,
				range: [-50, 50]
			},
			firstColumn: {
				required: true,
				number: true,
				integer: true,
				range: [-50, 50]
			},
			lastColumn: {
				required: true,
				number: true,
				integer: true,
				range: [-50, 50]
			}
		},
		// Manually entered in some custom error messages
		messages: {
			firstRow: {
				number: "Please enter an integer between -50 and 50.",
				integer: "Floats are not supported, please enter integers only."
			},
			lastRow: {
				number: "Please enter an integer between -50 and 50.",
				integer: "Floats are not supported, please enter integers only."
			},
			firstColumn: {
				number: "Please enter an integer between -50 and 50.",
				integer: "Floats are not supported, please enter integers only."
			},
			lastColumn: {
				number: "Please enter an integer between -50 and 50.",
				integer: "Floats are not supported, please enter integers only."
			}
		},
		errorElement: "span"
	});

	document.getElementById("firstRow").value = defaultFirstRow;
	document.getElementById("lastRow").value = defaultLastRow;
	document.getElementById("firstColumn").value = defaultFirstColumn;
	document.getElementById("lastColumn").value = defaultLastColumn;

	// Sources used for the sliders: https://api.jqueryui.com/slider/ & https://www.tutorialspoint.com/jqueryui/jqueryui_slider.htm

	// 1st slider - initalizing the row value
	$("#firstRowSlider").slider({
		value: defaultFirstRow,
		step: 1,
		min: -50,
		max: 50,
		slide: function(event, ui) {
			$("#firstRow").val(ui.value);
			updateTable();
		}
	});
	$("#firstRow").change(function() {
		var value = this.value;
		$("#firstRowSlider").slider("value", parseInt(value));
		updateTable();
	});

	// 2nd slider - ending the row value
	$("#lastRowSlider").slider({
		value: defaultLastRow,
		step: 1,
		min: -50,
		max: 50,
		slide: function(event, ui) {
			$("#lastRow").val(ui.value);
			updateTable();
		}
	});
	$("#lastRow").change(function() {
		var value = this.value;
		$("#lastRowSlider").slider("value", parseInt(value));
		updateTable();
	});

	// 3rd slider - initalizing the column value
	$("#firstColumnSlider").slider({
		value: defaultFirstColumn,
		step: 1,
		min: -50,
		max: 50,
		slide: function(event, ui) {
			$("#firstColumn").val(ui.value);
			updateTable();
		}
	});
	$("#firstColumn").change(function() {
		var value = this.value;
		$("#firstColumnSlider").slider("value", parseInt(value));
		updateTable();
	});

	// 4th slider - ending the column value
	$("#lastColumnSlider").slider({
		value: defaultLastColumn,
		step: 1,
		min: -50,
		max: 50,
		slide: function(event, ui) {
			$("#lastColumn").val(ui.value);
			updateTable();
		}
	});
	$("#lastColumn").change(function() {
		var value = this.value;
		$("#lastColumnSlider").slider("value", parseInt(value));
		updateTable();
	});

	// Initializes the jQuery UI tabbed interface.
	$("#tabs").tabs();

	// Generates a new, default table.
	var table = generateMultiplicationTable(defaultFirstRow, defaultLastRow, defaultFirstColumn, defaultLastColumn);
	createTab(table, generateMultiplicationTableLabel(defaultFirstRow, defaultLastRow, defaultFirstColumn, defaultLastColumn));
});