export default {
    name: 'user',
    title: 'User',
    type: 'document',
     grants: [
    {
      permissions: ['create'],
    },
  ],
    fields: [
        {
            name: 'userName',
            title: 'UserName',
            type: 'string'

        },

        {
            name: 'image',
            title: 'image',
            type: 'string'

        }
    ]
}