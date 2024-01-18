// Copyright (c) 2023, ad and contributors
// For license information, please see license.txt

frappe.ui.form.on('Membership', {
    refresh: function(frm) {
        // Set default value for From Date to today's date
        frm.set_value('from_date', frappe.datetime.nowdate());
    },
    on_submit: function(frm) {
        var customer_name = frm.doc.full_name;
        frappe.msgprint(__('Membership for {0} is successful', [customer_name]));
    }
});    

