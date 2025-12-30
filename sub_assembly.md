# sub_assembly.js — Program Flow Summary

---


## Initialization Flow
**On Page Load**
- `$(document).ready()`
  - Disable `#sub_ass_part_div`
  - Load `menu.html` → Highlight current page
  - Get `editProcessId`, `breadcrumb`, `edit_mode_exit` from sessionStorage
  - Set Username from localStorage
  - Call:
    - `check_login()`
    - `get_bom_recent()`
    - `get_bom_count()`

---

## Part and Process Autocomplete Flow

### Output Part
- Inputs: `#part_no_out`, `#part_name_out`
  - Autocomplete via `get_part_name_auto_wel.php`
  - On select:
    - Save `part_id`
    - Call: `get_bom_list()`, `get_bom_list_comp()`

### Input Part
- Inputs: `#part_no`, `#part_name`
  - On select → Save `part_id`, focus `#qty`

### Process
- Input: `#process_name`
  - Autocomplete via `get_process_auto.php`

---

## Adding to Welding Table

### Add Input Part
- Button: `#add_part_btn`
  - Validate input
  - Append `<li>` with part info to input column
  - Clear fields

### Add Process
- Button: `#add_process_btn`
  - Validate
  - Append process `<li>`
  - Call `get_machine()`

---

## Submit and Update Flow

### Submit Process
- Button: `#submit_btn`
  - Validate rows (must have input & process)
  - Collect data → `allWeldingData[]`
  - AJAX to `insert_wel_process1.php`

### Update Process
- Button: `#update_btn`
  - Same as submit
  - Also sends deleted process list
  - AJAX to `update_wel_process1.php`

---

## Welding Table Events

- `.add_pr` → Add row below current one
- `.delete_pr` or delete button → SweetAlert → Remove row
- First `td` click → Mark row as selected
- `.qty-editable` blur → Validate & update qty

---

## BOM Flow

### From Recent
- Click `#bom_recent_list li`
  - → `get_bom_output()`
    - → `selectAutocompleteByPartId()`
    - → `get_bom()`
    - → `get_bom_process_details()`

### From Dropdown
- On `#bom_list_select change`
  - → Load BOM
  - → Enable `#sub_ass_part_div`

---

## Sub-Assembly Part Flow

- Inputs: `#sub_ass_part_name`, `#sub_ass_part_no`
  - Autocomplete from `get_part_name_auto_sub.php`
  - On select:
    - Call `get_bom_output(part_id)`
    - Disable form

### Add Sub-Assembly
- Button: `#add_sub_ass`
  - AJAX → `insert_new_sub_part.php`

---

## Delete Flow

### Delete Process List
- Button: `#del_btn`
  - SweetAlert confirm
  - Call `del_process_list()` → AJAX to `del_wel_process1.php`

---

## Utility Functions

- `get_bom_process_details()`
- `get_machine()`, `get_machine_1()`
- `get_bom()`, `get_bom_list()`, `get_bom_list_comp()`
- `insert_new_part()`, `insert_new_input()`, `insert_new_process()`
- `update_input()`, `update_process()`, `update_output()`
- `delete_input_part()`, `delete_process()`, `delete_implement()`
- `selectAutocompleteByPartId()`
---
