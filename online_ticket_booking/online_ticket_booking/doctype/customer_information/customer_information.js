// Copyright (c) 2023, ad and contributors
// For license information, please see license.txt

frappe.ui.form.on('Customer Information', {
    refresh: function(frm) {
        

       
        if (frm.is_new()) {
            frm.set_intro("USE CAPITAL LETTERS TO FILL THE REGISTRATION");
        }
        
        frm.add_custom_button('Create Membership', () => {
            frappe.new_doc('Membership', {
                customer_information: frm.doc.name
            })
        })
        frm.add_custom_button('Ticket Booking', () => {
            frappe.new_doc('Ticket Booking', {
                customer_information: frm.doc.name
           })
        })
        frm.add_custom_button(__('Add Motorcycle Info'), function() {
            frm.events.custom_dialogue(frm);
        });  
// no age displayed for customer role, and will be displayed for other roles
                // Get the user's roles
        var user_roles = frappe.user_roles;
        
                // Check if the "customer" role is in the user's roles
        if (user_roles.includes('Customer')) {
                    // Hide the "Age" field
            frm.set_df_property('age', 'hidden', true);
            frm.remove_custom_button('Create Membership');
        } else {
                    // Show the "Age" field for other roles
            frm.set_df_property('age', 'hidden', false);
            frm.add_custom_button('Create Membership', () => {
                // Your logic for Create Membership button
            });
            }
        

     
    },

    


    // on_submit: function(frm) {
    //     frappe.msgprint("Registration Successful!");
    //},
    after_save: function(frm) {
    // Convert email to lowercase after saving
        frappe.db.set_value('Customer Information', frm.doc.name, 'email_address', frm.doc.email_address.toLowerCase());
        // frappe.db.set_value('Customer Information', frm.doc.name, 'first_name', frm.doc.first_name.toUpperCase());
        // frappe.db.set_value('Customer Information', frm.doc.name, 'last_name', frm.doc.last_name.toUpperCase());

        frappe.msgprint("Successful Customer Creation");
        
    },

    validate: function(frm) {
        var emailPattern = /^\w+([-+.'][^\s]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        var mobilePattern = /^\d*(?:\.\d{1,2})?$/;
    
        if (frm.doc.email_address && !emailPattern.test(frm.doc.email_address)) {
            frappe.msgprint('Enter a valid email address');
            frappe.validated = false;
        }

        if (frm.doc.phone && !mobilePattern.test(frm.doc.phone)) {
            frappe.msgprint('Enter a valid mobile number');
            frappe.validated = false;
        }
/////////////////


        // Check if any field (except 'email_address') contains lowercase letters
        const fieldsToCheck = ['first_name', 'last_name'];
        const invalidFields = [];

        fieldsToCheck.forEach(field => {
            const fieldValue = frm.doc[field];
            if (fieldValue && /[a-z]/.test(fieldValue)) {
                invalidFields.push(frappe.meta.get_label(frm.doc.doctype, field));
            }
        });

        if (invalidFields.length > 0) {
            const errorMessage = `Use capital letters to fill up the form for: ${invalidFields.join(', ')}`;
            frappe.msgprint({
                title: __('Validation Error'),
                indicator: 'red',
                message: errorMessage,
            });
            frappe.validated = false;
        }
     },

////////////////////////////////
    custom_dialogue: function(frm) {
        const mandatoryFields = ['first_name', 'last_name', 'email_address', 'phone', 'date_of_birth'];
        const missingFields = mandatoryFields.filter(field => !frm.doc[field]);


        if (missingFields.length > 0) {
            frappe.msgprint({
                title: __('Error'),
                indicator: 'red',
                message: `Please fill in the mandatory fields: ${missingFields.join(', ')}`,
            });
            return;
        }        
        frappe.prompt([
            {'fieldname': 'motorcycle_brand', 'fieldtype': 'Data', 'label': 'Motorcycle Brand', 'reqd': 1},
            {'fieldname': 'column_break_1', 'fieldtype': 'Column Break'},
            {'fieldname': 'model_name', 'fieldtype': 'Data', 'label': 'Model Name','depends_on': 'eval:doc.motorcycle_brand'}, 
            {'fieldname': 'color', 'fieldtype': 'Data', 'label': 'Color',},
            {'fieldname': 'section_break_1', 'fieldtype': 'Section Break'},
            {'fieldname': 'insurance_number', 'fieldtype': 'Int', 'label': 'Insurance Number', 'reqd': 1},
            {'fieldname': 'pollution_expiring_date', 'fieldtype': 'Date', 'label': 'Pollution Expiring Date', 'reqd': 1}
        ],
        function(values){
            // To Populate Membership fields
            frappe.call({
                method: 'online_ticket_booking.online_ticket_booking.doc_events.membership.update_from_dialog_box',
                args: {
                    email: frm.doc.email_address,
                    motorcycle_brand: values.motorcycle_brand,
                    model_name: values.model_name,
                    color: values.color,
                    insurance_number: values.insurance_number,
                    pollution_expiring_date: values.pollution_expiring_date
                },
                callback: function(response) {
                    if (response.message) {
                        frappe.msgprint(response.message);
                    }
                }
            });
            
        },
        'Enter Motorcycle Information', 'Save');
    }
});    

