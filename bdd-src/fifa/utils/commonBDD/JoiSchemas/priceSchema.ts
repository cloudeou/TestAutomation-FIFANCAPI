import Joi from '@hapi/joi';

export const priceSchema = Joi.array().min(1).max(2).items(
    Joi.object({
      priceType: Joi.string().valid('One_Time', 'Recurrent').required(),
      price: Joi.object({
        dutyFreeAmount: Joi.object({
          value: Joi.number().required()
        })
      }),
      priceAlteration: Joi.array()
    })
  )
