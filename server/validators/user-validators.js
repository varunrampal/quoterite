const { body, validationResult } = require('express-validator');

//Signup request validations
const userSignupValidationRules = () => {
  return [

     // name
     body('name').notEmpty().withMessage('must be provided'),
    // username must be an email
    body('email').notEmpty().withMessage('must be provided').isEmail().withMessage('invalid email-id'),
    // phon number
    body('phone').notEmpty().withMessage('must be provided').isNumeric().withMessage('only digits are allowed'),
    // password must be at least 6 chars long
    body('password').notEmpty().withMessage('must be provided').isLength({ min: 6 }).withMessage('The password must be 6 chars long'),
  ]
}

//login request validations
const userloginValidationRules = () => {
  return [
  
    // username must be an email
    body('email').notEmpty().withMessage('must be provided').isEmail().withMessage('invalid email-id'),
    // password must be provided
    body('password').notEmpty().withMessage('must be provided')
  ]
}

//user list validations
const userlistValidationRules = () => {
  return [
  
    // page must be provided
    body('page').notEmpty().withMessage('must be provided'),
    // pagination must be provided
    body('pagination').notEmpty().withMessage('must be provided'),
     // role must be provided
    body('role').notEmpty().withMessage('must be provided')
  ]
}

//user count
const userCountValidationRules = () => {
  return [
  
    // role must be provided
    body('role').notEmpty().withMessage('must be provided')
  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}

module.exports = {
  userSignupValidationRules,
  userloginValidationRules,
  userlistValidationRules,
  userCountValidationRules,
  validate,
}