$(document).ready( function () {
	 var table = $('#employeesTable').DataTable({
			"sAjaxSource": "/employees",
			"sAjaxDataProp": "",
			"order": [[ 0, "asc" ]],
			"aoColumns": [
			      { "mData": "id"},
		          { "mData": "productId" },
				  { "mData": "description" },
				  { "mData": "imageUrl" },
				  { "mData": "price" }
			]
	 })
});