import Joi from '@hapi/joi';

export const priceAlterationSchema = Joi.array().items(
  Joi.object({
    catalogId: Joi.string().min(19).max(19).required(),
    id: null,
    action: Joi.string().valid("Add").required(),
    applicationDuration: Joi.number().min(0).required(),
    applicationDurationUnits: Joi.string().valid("Months").required(),
    description: Joi.string(),
    name: Joi.string().required(),
    priceType: Joi.string().valid("Recurrent").required(),
    price: Joi.object({
      dutyFreeAmount: Joi.object({
        value: Joi.number().required()
      }) 
    })
  })
)
