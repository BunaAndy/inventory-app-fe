export const item_schema = {
    'type': 'object',
    'properties' : {
        'Barcode': {
            'type' : 'string'
        },
        'Name': {
            'type' : 'string'
        },
        'Quantity': {
            'type' : 'integer'
        },
        'Quantity Needed': {
            'type' : 'integer'
        },
        'Catalog': {
            'type': 'string'
        }
    },
    'required': [
        'Barcode', 'Name', 'Quantity', 'Quantity Needed', 'Catalog'
    ]
}

export const items_schema = {
    'type': 'object',
    'properties': {
        'Entries' : {
            'type' : 'array',
            'items' : item_schema,
        },
        'Project' : {
            'type' : 'string',
        }
    },
    'required': [
        'Entries', 'Project'
    ],
}

export const inventory_schema = {
    'type': 'object',
    'properties' : {
        'Barcode': {
            'type' : 'string'
        },
        'Name': {
            'type' : 'string'
        },
        'Quantity': {
            'type' : 'integer'
        },
        'Catalog': {
            'type': 'string'
        }
    },
    'required': [
        'Barcode', 'Name', 'Quantity', 'Catalog'
    ]
}

export const project_schema = {
    'type': 'object',
    'properties': {
        'Project Number': {
            'type': 'string'
        },
        'Project Name': {
            'type': 'string'
        }
    },
    'required': [
        'Project Number', 'Project Name'
    ]
}

export const projects_schema = {
    'type': 'object',
    'properties': {
        'Projects' : {
            'type' : 'array',
            'items' : project_schema,
        }
    },
    'required': [
        'Entries'
    ],
}