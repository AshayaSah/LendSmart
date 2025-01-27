frappe.ui.form.on("Retail Loan", {
  onload(frm) {
    const fullname = frappe.session.user_fullname;
    const loggedin_user = frappe.session.user;
    frm.set_value("logged_in_user", fullname);
    frm.set_value("logged_in_user_name", loggedin_user);
    if (frm.is_new()) {
      const workflow = frm.doc.workflow_state;
      const user = frappe.session.user;
      frm.set_value("from_workstep", workflow);
      frm.set_value("users", user);
    }
    update_decision_options(frm);
    check_and_mark_dirty_and_clear_fields(frm);
    check_save_log_state(frm);
  },
  refresh: function (frm) {
    // Add the Upload Document button
    frm.add_custom_button(__("Document Upload"), function () {
      // Trigger the file uploader
      upload_document_with_type(frm);
    });
  },
  save_log(frm) {
    if (frm.disable_save_log_button) {
      return;
    }

    const {
      decision,
      date,
      logged_in_user,
      from_workstep,
      to_workstep,
      comment,
    } = frm.doc;

    const child_table = frm.doc.table_vhat || [];
    const last_row =
      child_table.length > 0 ? child_table[child_table.length - 1] : null;

    if (last_row && last_row.from_workstep === frm.doc.workflow_state) {
      last_row.decision = decision;
      last_row.date_klsu = date;
      last_row.logged_in_user = logged_in_user;
      last_row.from_workstep = from_workstep;
      last_row.to_workstep = to_workstep;
      last_row.comment = comment;
    } else {
      const new_row = frm.add_child("table_vhat");
      new_row.decision = decision;
      new_row.date_klsu = date;
      new_row.logged_in_user = logged_in_user;
      new_row.from_workstep = from_workstep;
      new_row.to_workstep = to_workstep;
      new_row.comment = comment;
    }

    frm.refresh_field("table_vhat");
    check_save_log_state(frm);
  },

  validate(frm) {
    frm.events.save_log(frm);
  },

  decision(frm) {
    handle_to_workstep_field(frm);
    //set_to_workstep_options(frm);
    update_last_child_row(frm);
  },

  comment(frm) {
    update_last_child_row(frm);
  },
});

const CONFIG = {
  roles: ["RM", "BM", "SH", "DCEO", "CEO", "CRM", "CAD Maker", "CAD Checker"], // Role hierarchy with CRM included
  decisions: {
    default: ["Recommend"], // Default decision for RM
    approver: ["Approve", "Query", "Deferral", "Decline"], // Decisions for final approver
    intermediate: ["Support", "Query", "Deferral", "Decline"], // Intermediate roles
    response: ["Query Response", "Deferral Response"], // Response options for Query/Deferral
    CAD: ["Approve", "Query"], //For CAD Maker and Checker
  },
  decision_visibility: [
    "Query",
    "Deferral",
    "Decline",
    "Query Response",
    "Deferral Response",
  ], // Decisions that require `to_workstep`
};

function update_decision_options(frm) {
  const user_roles = frappe.user_roles;
  const current_role = get_current_user_role(user_roles);
  const final_approver = frm.doc.final_approver;
  const is_final_approver = final_approver === current_role;
  const is_rm = current_role === "RM";
  const is_cad_maker = current_role === "CAD Maker";
  const is_cad_checker = current_role === "CAD Checker";
  const child_table = frm.doc.table_vhat || [];
  const last_row =
    child_table.length > 0 ? child_table[child_table.length - 1] : null;

  let options = [];

  if (last_row && last_row.to_workstep === frm.doc.workflow_state) {
    if (last_row.decision === "Query") {
      options = ["Query Response"];
    } else if (last_row.decision === "Deferral") {
      options = ["Deferral Response"];
    }
  }

  if (options.length === 0) {
    if (is_final_approver) {
      options = CONFIG.decisions.approver;
    } else if (is_rm) {
      options = CONFIG.decisions.default;
    } else if (is_cad_maker) {
      options = ["Recommend", "Query"];
    } else if (is_cad_checker) {
      options = ["Approve", "Query"];
    } else {
      options = CONFIG.decisions.intermediate;
    }
  }

  if (
    last_row &&
    last_row.decision == "Approve" &&
    last_row.from_workstep == "CAD Checker"
  ) {
    options = ["CAD Recommend"];
  }

  if (last_row && last_row.decision == "CAD Recommend") {
    frm.set_value("decision", null);
    frm.set_df_property("decision", "hidden", true);
    frm.set_df_property("decision", "reqd", false);
    return;
  }

  frm.set_df_property("decision", "options", options.join("\n"));
  handle_to_workstep_field(frm);
}

function handle_to_workstep_field(frm) {
  const current_role = get_current_user_role(frappe.user_roles);

  const decision = frm.doc.decision;
  const should_show_to_workstep = CONFIG.decision_visibility.includes(decision);

  frm.set_df_property("to_workstep", "hidden", !should_show_to_workstep);
  frm.set_df_property("to_workstep", "reqd", should_show_to_workstep);

  if (should_show_to_workstep) {
    if (
      current_role == "CRM" ||
      current_role == "CAD Maker" ||
      current_role == "CAD Checker"
    ) {
      set_to_workstep_for_crm_or_cad(frm);
    } else {
      set_to_workstep_options(frm);
    }
  } else {
    frm.set_value("to_workstep", null);
  }
}

function set_to_workstep_options(frm) {
  const current_role = get_current_user_role(frappe.user_roles);
  const role_hierarchy = CONFIG.roles;
  const child_table = frm.doc.table_vhat || [];
  const last_row =
    child_table.length > 0 ? child_table[child_table.length - 1] : null;

  if (frm.fields_dict.to_workstep.df.hidden) {
    frm.set_value("to_workstep", null);
    return;
  }

  if (
    last_row &&
    last_row.decision &&
    ["Query Response", "Deferral Response"].includes(frm.doc.decision)
  ) {
    frm.set_df_property("to_workstep", "options", last_row.from_workstep);
    return;
  }

  if (!current_role) {
    frm.set_df_property("to_workstep", "options", "");
    return;
  }

  const current_index = role_hierarchy.indexOf(current_role);

  if (current_index > -1) {
    const available_roles = role_hierarchy.slice(0, current_index).join("\n");
    frm.set_df_property("to_workstep", "options", available_roles);
  } else {
    frm.set_df_property("to_workstep", "options", "");
  }
}

function set_to_workstep_for_crm_or_cad(frm) {
  let role_hierarchy = CONFIG.roles.slice();
  const final_approver = frm.doc.final_approver;
  const final_approver_index = role_hierarchy.indexOf(final_approver);
  const current_role = get_current_user_role(frappe.user_roles);
  const child_table = frm.doc.table_vhat || [];
  const last_row =
    child_table.length > 0 ? child_table[child_table.length - 1] : null;

  if (frm.fields_dict.to_workstep.df.hidden) {
    console.log("Hero");
    frm.set_value("to_workstep", null);
    return;
  }

  if (
    last_row &&
    last_row.decision &&
    ["Query Response", "Deferral Response"].includes(frm.doc.decision)
  ) {
    frm.set_df_property("to_workstep", "options", last_row.from_workstep);
    return;
  }

  if (!current_role) {
    frm.set_df_property("to_workstep", "options", "");
    return;
  }

  if (current_role == "CAD Checker") {
    frm.set_df_property("to_workstep", "options", "CAD Maker");
    return;
  }

  if (final_approver_index > -1) {
    if (current_role == "CAD Maker") {
      const roles_up_to_final_approver = role_hierarchy.slice(
        0,
        final_approver_index + 1
      );

      const insert_index = roles_up_to_final_approver.length - 1;
      roles_up_to_final_approver.splice(insert_index, 0, "CRM");

      const available_roles_with_crm = roles_up_to_final_approver.join("\n");

      frm.set_df_property("to_workstep", "options", available_roles_with_crm);
      console.log("Available roles (with CRM):", available_roles_with_crm);
    } else {
      const available_roles = role_hierarchy
        .slice(0, final_approver_index)
        .join("\n");
      frm.set_df_property("to_workstep", "options", available_roles);
      console.log(available_roles);
    }
  } else {
    frm.set_df_property("to_workstep", "options", "");
  }
}

function update_last_child_row(frm) {
  const child_table = frm.doc.table_vhat || [];
  const last_row =
    child_table.length > 0 ? child_table[child_table.length - 1] : null;

  if (last_row && last_row.from_workstep === frm.doc.workflow_state) {
    last_row.decision = frm.doc.decision;
    last_row.comment = frm.doc.comment;

    frm.refresh_field("table_vhat");
  }
}

function check_save_log_state(frm) {
  const child_table = frm.doc.table_vhat || [];
  const current_from_workstep = frm.doc.workflow_state;

  if (child_table.length > 0) {
    const last_row = child_table[child_table.length - 1];
    if (last_row.from_workstep === current_from_workstep) {
      frm.disable_save_log_button = true;
      frm.set_df_property("save_log", "disabled", 1);
    } else {
      frm.disable_save_log_button = false;
      frm.set_df_property("save_log", "disabled", 0);
    }
  } else {
    frm.disable_save_log_button = false;
    frm.set_df_property("save_log", "disabled", 0);
  }
}

function check_and_mark_dirty_and_clear_fields(frm) {
  const child_table = frm.doc.table_vhat || [];
  const current_role = get_current_user_role(frappe.user_roles);

  if (child_table.length > 0) {
    const last_row = child_table[child_table.length - 1];

    if (last_row.from_workstep !== current_role) {
      frm.set_value("decision", null);
      frm.set_value("comment", null);
      frm.dirty();
    }
  }
}

function get_current_user_role(user_roles) {
  const role_priority = CONFIG.roles;
  for (let role of role_priority) {
    if (user_roles.includes(role)) {
      return role;
    }
  }
  return null;
}

function upload_document_with_type(frm) {
  // Prompt the user to select a document type first
  frappe.prompt(
    {
      label: "Document Type",
      fieldname: "document_type",
      fieldtype: "Select",
      options: [
        "Citizenship",
        "Blueprint",
        "Income Statement",
        // Add more document types here
      ],
      reqd: 1,
    },
    (values) => {
      const file_input = new frappe.ui.FileUploader({
        allow_multiple: false,
        as_dataurl: false,
        disable_file_browser: true,
        options: ["My Device"],
        allow_private: true,
        on_success: (file) => {
          console.log("File Metadata:", file);
          console.log("File URL:", values);

          frappe.call({
            method: "loan.custom_python.omnidocs.upload_to_DMS",
            args: {
              file: "http://192.168.10.41/" + file.file_url,
              file_name: file.file_name,
              document_type: values.document_type,
              file_ext: "png",
            },
            callback: (response) => {
              if (response.message) {
                frappe.msgprint(__("File uploaded successfully!"));
              }
            },
            error: (err) => {
              frappe.msgprint(
                __("Failed to upload the file. Please try again.")
              );
              console.error(err);
            },
          });
        },
        error: (err) => {
          frappe.msgprint(__("Failed to upload file. Please try again."));
          console.error(err);
        },
      });

      setTimeout(() => {
        const buttons = document.querySelectorAll(
          ".btn.btn-secondary.btn-sm.btn-modal-secondary"
        );
        buttons.forEach((button) => {
          if (button.textContent.trim() === "Set all private") {
            button.style.display = "none";
          }
        });
      }, 500);
    },
    "Select Document Type",
    "Next"
  );
}
