// Copyright (c) 2023, ad and contributors
// For license information, please see license.txt
/* eslint-disable */




frappe.query_reports["Custom Script Report For Ticket Booking"] = {
    "filters": [
        {
            'fieldname': 'event',
            'label': __('Event'),
            'fieldtype': 'Link',
            'options': 'Event Details'
        },
        {
            'fieldname': 'customer_information',
            'label': __('Customer Information'),
            'fieldtype': 'Link',
            'options': 'Customer Information'
        },
        {
            "fieldname": "date_range",
            "label": __("Date Range"),
            "fieldtype": "Select",
            "options": "\nWeekly\nMonthly",
            "reqd": 0
        },
        {
            "fieldname": "from_date",
            "label": __("From Date"),
            "fieldtype": "Date",
            "reqd": 0
        },
        {
            "fieldname": "to_date",
            "label": __("To Date"),
            "fieldtype": "Date",
            "reqd": 0
        }

        // Add more filters as needed
    ],
};




// # Copyright (c) 2023, ad and contributors
// # For license information, please see license.txt





from __future__ import unicode_literals
import frappe
from frappe import _
from datetime import datetime, timedelta
from frappe.model.mapper import get_mapped_doc

def execute(filters=None):
    columns = get_columns(filters)
    tb_data = get_tb_data(filters)
   # graph_data = get_graph_data() #

    if n    
        })
        data.append(row)

    return columns, data #None, get_chart_config(graph_data) #added after data

def get_columns(filters):
    columns = [
        {
            'fieldname': 'event',
            'label': _('Event'),
            'fieldtype': 'Link',
            'options': 'Event Details',
            'width': 120
        },
        {
            'fieldname': 'event_name',
            'label': _('Event Name'),
            'fieldtype': 'Data',
            'width': 120
        },
        {
            'fieldname': 'customer_information',
            'label': _('Customer Information'),
            'fieldtype': 'Link',
            'options': 'Customer Information',
            'width': 120
        },
        {
            'fieldname': 'customer_name',
            'label': _('Customer Name'),
            'fieldtype': 'Data',
            'width': 150
        },
        {
            'fieldname': 'email_address',
            'label': _('Email Address'),
            'fieldtype': 'Data',
            'width': 110
        },
        {
            'fieldname': 'ticket_price',
            'label': _('Ticket Price'),
            'fieldtype': 'Currency',
            'width': 120
        },
        {
            'fieldname': 'number_of_tickets',
            'label': _('Number of Tickets'),
            'fieldtype': 'Int',
            'width': 120
        },
        {
            'fieldname': 'total_amount',
            'label': _('Total Amount'),
            'fieldtype': 'Currency',
            'width': 120
        },
        {
            'fieldname': 'booking_date',
            'label': _('Booking Date'),
            'fieldtype': 'Date',
            'width': 120
        },
        {
            'fieldname': 'payment_status',
            'label': _('Payment Status'),
            'fieldtype': 'Data',
            'width': 120
        },
        {
            'fieldname': 'location',
            'label': _('Location'),
            'fieldtype': 'Data',
            'width': 150
        }        
    ]

    # If both filters are empty, display all the fields
    if not filters:
        return columns

    # If only Event is selected, display specific fields
    if filters.get('event') and not filters.get('customer_information'):
        return [
            col for col in columns if col['fieldname'] in ['event', 'event_name', 'customer_information', 'customer_name', 'email_address']
        ]

    # If both Event and Customer Information are selected, display specific fields
    if filters.get('event') and filters.get('customer_information'):
        return [
            col for col in columns if col['fieldname'] in ['event', 'event_name', 'customer_information', 'customer_name', 'email_address', 'ticket_price', 'number_of_tickets', 'total_amount']
        ]

    return columns

def get_tb_data(filters):
    conditions = get_conditions(filters)
    data = frappe.get_all(
        doctype='Ticket Booking',
        fields=['event', 'event_name', 'customer_information', 'customer_name', 'email_address', 'ticket_price', 'number_of_tickets', 'total_amount', 'payment_status', 'booking_date'],
        filters=conditions,
        order_by='name desc'
    )

    #Fetch 'Location' from 'Event Details' through the 'Event' field in 'Ticket Booking'
    updated_data = []
    for entry in data:
        updated_entry = entry.copy()
        if 'event' in entry and entry['event']:
            event_details = frappe.get_doc('Event Details', entry['event'])
            updated_entry['location'] = event_details.location if event_details else None
        updated_data.append(updated_entry)

    return updated_data



def get_conditions(filters):
    conditions = {}

    if filters.get('event'):
        conditions['event'] = filters.get('event')

    if filters.get('customer_information'):
        conditions['customer_information'] = filters.get('customer_information')

    if filters.get('date_range') == 'Weekly':
        week_start_date = frappe.utils.add_days(frappe.utils.nowdate(), -7)
        conditions['booking_date'] = ['>=', week_start_date]

    if filters.get('date_range') == 'Monthly':
        month_start_date = frappe.utils.get_first_day(frappe.utils.nowdate())
        conditions['booking_date'] = ['>=', month_start_date]

    if filters.get('from_date') and not filters.get('to_date') and not filters.get('date_range'):
        conditions['booking_date'] = ['>=', filters.get('from_date')]

    if not filters.get('from_date') and filters.get('to_date') and not filters.get('date_range'):
        to_date = datetime.strptime(filters.get('to_date'), '%Y-%m-%d') + timedelta(days=1)
        conditions['booking_date'] = ['<', to_date.strftime('%Y-%m-%d')]  # Convert back to string format

    if filters.get('from_date') and filters.get('to_date') and not filters.get('date_range'):
        conditions['booking_date'] = ['>=', filters.get('from_date'), '<=', filters.get('to_date')]

    # Custom code for default condition if no filters are applied
    if not any([filters.get('event'), filters.get('customer_information'), filters.get('date_range'), filters.get('from_date'), filters.get('to_date')]):
        conditions['booking_date'] = ['<=', frappe.utils.nowdate()]

    return conditions

