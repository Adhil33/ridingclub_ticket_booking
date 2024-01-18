# Copyright (c) 2023, ad and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class CustomerInformation(Document):
    def before_save(self):
        self.full_name = f'{self.first_name} {self.last_name or ""}'
        if self.date_of_birth:
            dob = frappe.utils.getdate(self.date_of_birth)  # Convert dob to datetime object
            
            # Convert current date to datetime.date object
            today = frappe.utils.getdate(frappe.utils.nowdate())
            
            age = (today - dob).days // 365  # Approximate age in years
            self.age = age
 