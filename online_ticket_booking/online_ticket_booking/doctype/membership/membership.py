# Copyright (c) 2023, ad and contributors
# For license information, please see license.txt
# from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.model.document import Document
from frappe.model.docstatus import DocStatus

class Membership(Document):
    def onload(self):
        self.update_fetched_fields() #this onload is also for value update from CI to MS
        self.update_booked_tickets()#this will update value if a new ticket booking is done
        
    def before_submit(self):
        exists = frappe.db.exists(
            "Membership",
            {
                "customer_information": self.customer_information,
                "docstatus": DocStatus.submitted(),
                # check if the membership's end date is later than this membership's start date
                "to_date": (">", self.from_date),
            },
        )
        if exists:
            frappe.throw("There is an active membership for this Customer")
        
    
        self.update_fetched_fields()  #2 this line used for update the change in CI to MS
    ########################
    #fetch data from member and stays after submit
    def update_fetched_fields(self):    
        if self.customer_information:
        # Fetch data from Library Member
            customer_information = frappe.get_doc("Customer Information", self.customer_information)
            self.set("fetched_email", customer_information.email_address)
            self.set("fetched_phone", customer_information.phone)
     ###########################   



#to fill the booked tickets table in MS by retrieving data from TB
    def after_insert(self):
        self.update_booked_tickets()
    def update_booked_tickets(self):
        if self.customer_information:
            tickets = frappe.get_all("Ticket Booking", filters={"customer_information": self.customer_information}, fields=["event", "booking_date"])
            if tickets:
                self.booked_tickets = []
                for ticket in tickets:
                    row = self.append("booked_tickets", {})
                    row.event_name = ticket.event
                    row.date = ticket.booking_date
                    
    ###################################
    def validate(self):
        if self.customer_information:
            customer_info = frappe.get_doc("Customer Information", self.customer_information)
            if customer_info.workflow_state != "Approved":
                frappe.throw(_("Cannot create a Membership wait for approval!"))

#####################################

    def validate(self):
        self.send_mail()
    
    def send_mail(self):
        template = "test"
        args = {
            "full_name": self.full_name,
        }

        frappe.sendmail(
            recipients=[self.fetched_email],
            template=template,
            args=args,
            subject=_("This is a test email"),
        )




