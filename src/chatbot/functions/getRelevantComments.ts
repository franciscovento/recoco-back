export const getRelevantCommentsFunction = {
  name: 'getRelevantComments',
  description:
    'Busca comentarios relevantes si el usuario menciona un nombre propio o el nombre de una materia. Responde con un resumen de los comentarios encontrados.',
  strict: false,
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
      },
    },
    required: ['query'],
  },
};
