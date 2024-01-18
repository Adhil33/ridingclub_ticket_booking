
import frappe

@frappe.whitelist()
def update_from_dialog_box(email, motorcycle_brand, model_name, color, insurance_number, pollution_expiring_date):
    # Check if the Membership exists for the provided email
    membership = frappe.get_list("Membership", filters={"fetched_email": email}, fields=["name"])

    if membership:
        # Fetch the Membership document
        membership_doc = frappe.get_doc("Membership", membership[0].name)

        # Update the fields
        membership_doc.motorcycle_brand = motorcycle_brand
        membership_doc.model_name = model_name
        membership_doc.color = color
        membership_doc.insurance_number = insurance_number
        membership_doc.pollution_expiring_date = pollution_expiring_date
        membership_doc.set("status", "Submitted")        
        membership_doc.save()

        frappe.db.commit()
        return {"message": "Fields updated in Membership"}
    else:
        return {"message": "Membership not found for provided email"}


##########################nas dialog box js

# // /home/user/employee-bench/apps/employee_management/employee_management/employee_management/doctype/employee_membership/employee_membership.js

# frappe.ui.form.on('Employee Membership', {
#     before_save: function(frm) {
#         frappe.confirm(
#             'Are you sure you want to proceed?',
#             () => {
#                 let d = new frappe.ui.Dialog({
#                     title: 'Enter Employee Information',
#                     fields: [
#                         {
#                             label: 'Employee Name',
#                             fieldname: 'employee_name',
#                             fieldtype: 'Link',
#                             options: 'Employee Details',
#                             reqd: 1
#                         },
#                         {
#                             label: 'City',
#                             fieldname: 'city',
#                             fieldtype: 'Data',
#                             reqd: 1
#                         },
#                         {
#                             label: 'Address',
#                             fieldname: 'address',
#                             fieldtype: 'Data',
#                             reqd: 1
#                         }
#                     ],
#                     primary_action_label: 'Submit',
#                     primary_action: function() {
#                         // Get values from the dialog fields
#                         let employee_name = d.get_value('employee_name');
#                         let city = d.get_value('city');
#                         let address = d.get_value('address');

#                         // Perform the update using frappe.call
#                         frappe.call({
#                             method: 'employee_management.employee_management.doctype.employee_membership.employee_membership.update_employee_details',
#                             args: {
#                                 employee_name: employee_name,
#                                 city: city,
#                                 address: address
#                             },
#                             callback: function(response) {
#                                 frappe.msgprint('Employee Details fields updated!');
#                                 d.hide();
#                             }
#                         });
#                     }
#                 });

#                 d.show();
#             },
#             'Confirm Save'
#         );
#     }
# });


