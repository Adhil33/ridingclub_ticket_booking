// Copyright (c) 2023, ad and contributors
// For license information, please see license.txt

frappe.ui.form.on('Ticket Booking', {

    on_submit: function(frm) {
        frappe.msgprint(__('Booking Successful!'));
    },


    onload: function(frm) {
        // Set the currency for the Ticket Price field to INR
        frm.set_currency('ticket_price', 'INR');

        // Set the currency for the Total Amount field to INR
        frm.set_currency('total_amount', 'INR');
    }
});
