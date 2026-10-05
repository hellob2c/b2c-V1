/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const admin = "@request.auth.role = 'admin'";
    const col = new Collection({
      name: 'cms_content',
      type: 'base',
      // Published content is public; drafts are admin-only.
      listRule: "status = 'published' || @request.auth.role = 'admin'",
      viewRule: "status = 'published' || @request.auth.role = 'admin'",
      createRule: admin,
      updateRule: admin,
      deleteRule: admin,
      fields: [
        { name: 'key', type: 'text', required: true, max: 80 },
        { name: 'title', type: 'text', required: true, max: 200 },
        { name: 'data', type: 'json', maxSize: 5000000 },
        {
          name: 'status',
          type: 'select',
          required: true,
          maxSelect: 1,
          values: ['draft', 'published'],
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        "CREATE UNIQUE INDEX idx_cms_content_key ON cms_content (key)",
      ],
    });
    app.save(col);
  },
  (app) => {
    app.delete(app.findCollectionByNameOrId('cms_content'));
  },
);
