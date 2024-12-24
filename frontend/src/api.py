import frappe
import requests
from frappe import _
from frappe import auth
from frappe.core.doctype.user.user import sign_up

@frappe.whitelist(allow_guest=True)
def fetch_retail_table_data(limit=100):
    """
    Fetch Retail Loan Product Table data linked to the Retail Loan doctype.
    :param limit: Limit the number of records (default is 100).
    :return: List of child table records as a JSON response.
    """
    try:
        # Fetch child table data linked to the parent doctype
        data = frappe.db.sql(
            """
            SELECT 
                child_table.*
            FROM 
                `tabRetail Loan Product Table` AS child_table
            JOIN 
                `tabRetail Loan` AS parent_table
            ON 
                child_table.parent = parent_table.name
            ORDER BY 
                parent_table.name DESC
            LIMIT %s
            """,
            (limit,),
            as_dict=True
        )

        return {"success": True, "data": data}
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Fetch Retail Loan Product Table Data Error")
        return {"success": False, "message": str(e)}
