// Copyright (c) 2023, ad and contributors
// For license information, please see license.txt


frappe.ui.form.on('Event Details', {
    refresh: function(frm) {
        // Add custom scripts here

        // Format Ticket Price in Indian Rupees
        frm.fields_dict['ticket_price'].df.options = 'Currency:INR';
        frm.fields_dict['ticket_price'].refresh();
    },
    after_save: function(frm) {
        frappe.msgprint(__('Event Published'));
    }
});
