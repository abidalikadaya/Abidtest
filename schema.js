var _ = require('lodash');

var base_model = {
  id: { type: 'increments', nullable: false, primary: true },
  created_by: { type: 'integer', nullable: true, unsigned: true, references: 'users.id' },
  updated_by: { type: 'integer', nullable: true, unsigned: true, references: 'users.id' },
  deleted_by: { type: 'integer', nullable: true, unsigned: true, references: 'users.id' },
  created_at: { type: 'dateTime', nullable: false },
  updated_at: { type: 'dateTime', nullable: true },
  deleted_at: { type: 'dateTime', nullable: true },
  is_active: { type: 'boolean', nullable: false, defaultTo: true },
  deleted_on: { type: 'dateTime', nullable: true },
};
var user_type = {
  'DEFAULT_USER': 'D_U',
  'MANAGER': 'M_M',
  'COST_CONTROL': 'C_C',
  'WAREHOUSE': 'W_M',
  'PROCUREMENT': 'P_M'
};

var procurement_status = {
  'PENDING_FULFILLMENT': 'P_FF',
  'LINE_MANAGER_APPROVED': 'LM_A',
  'LINE_MANAGER_REJECTED': 'LM_R',
  'COST_CONTROL_APPROVED': 'CC_A',
  'COST_CONTROL_REJECTED': 'CC_R',
  'WAREHOUSE_APPROVED': 'WH_A',
  'WAREHOUSE_REJECTED': 'WH_R',
  'PROCUREMENT_APPROVED': 'P_A',
  'PROCUREMENT_REJECTED': 'P_R',
  'PROCUREMENT_CLOSED': 'P_C'
};

var schema = {
  users: {
    email: { type: 'string', maxlength: 254, nullable: false, unique: true },
    mobile: { type: 'string', maxlength: 150, nullable: false },
    user_type: { type: 'enu', enum_val: _.values(user_type), maxlength: 5, nullable: false },
    user_name: { type: 'string', maxlength: 150, nullable: false, unique: true },
    first_name: { type: 'string', maxlength: 150, nullable: false },
    middle_name: { type: 'string', maxlength: 150, nullable: false },
    last_name: { type: 'string', maxlength: 150, nullable: false },
    manager_id: { type: 'integer', nullable: true, unsigned: true, references: 'users.id' },
    password: { type: 'string', maxlength: 50, nullable: false },
    department_id: { type: 'integer', nullable: false },
  },

  procurements: {
    item_code: { type: 'string', maxlength: 254, nullable: false },
    item_description: { type: 'string', maxlength: 150, nullable: false },
    amount: { type: 'integer', nullable: false, unsigned: true },
    status: { type: 'enu', enum_val: _.values(procurement_status), maxlength: 5, nullable: false },
  },

  departments: {
    name: { type: 'string', maxlength: 150, nullable: false },
    description: { type: 'string', maxlength: 150, nullable: false },
    prending_status: { type: 'string', maxlength: 5, nullable: false },
  },

  products: {
    code: { type: 'string', maxlength: 150, nullable: false },
    name: { type: 'string', maxlength: 150, nullable: false },
    description: { type: 'string', maxlength: 150, nullable: false },
  },

  procurement_audits: {
    procurement_id: { type: 'integer', nullable: false, unsigned: true, references: 'procurements.id' },
    approver_id: { type: 'integer', nullable: false, unsigned: true, references: 'users.id' },
    approver_comment: { type: 'string', maxlength: 150, nullable: false },
  }

}

module.exports = {
  schema: schema,
  base_model: base_model
};
