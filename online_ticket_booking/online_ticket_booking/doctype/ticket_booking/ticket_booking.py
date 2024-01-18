# Copyright (c) 2023, ad and contributors
# For license information, please see license.txt
import frappe
from frappe import _
from frappe.model.document import Document

class TicketBooking(Document):
    def validate(self):
        # Check if the requested number of tickets is available
        event = frappe.get_doc("Event Details", self.event)
        if event.total_tickets_available < self.number_of_tickets:
            frappe.throw("Not enough tickets available for the selected event.")

        # Update total tickets available after successful booking
        event.total_tickets_available -= self.number_of_tickets
        event.save()

        # Calculate total amount based on ticket price and number of tickets
        self.total_amount = event.ticket_price * self.number_of_tickets

        # Update booking date
        self.booking_date = frappe.utils.now()
        # Function to get filtered Customer Information
    def get_customer_information():
    # Fetch Customer Information linked through Membership
        membership_linked_customers = frappe.get_list(
            "Customer Information",
            filters={"membership_fieldname": ["is_set", "like", "%Membership%"]}
        # Replace "membership_fieldname" with the actual field linking Membership to Customer Information
        )

        return membership_linked_customers

# Other functions or customizations related to Ticket Booking might be here

        








