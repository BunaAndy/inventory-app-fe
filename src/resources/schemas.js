export const item_schema = {
    'type': 'object',
    'properties' : {
        'Barcode': {
            'type' : 'string',
        },
        'Name': {
            'type' : 'string',
        },
        'Quantity': {
            'type' : 'integer',
            'default' : 0
        },
        'Quantity Needed': {
            'type' : 'integer',
            'default' : 0
        },
        'Catalog': {
            'type': 'string',
            'default' : ''
        }
    },
    'required': [
        'Name', 'Quantity', 'Quantity Needed',
    ]
}

export const items_schema = {
    'type': 'object',
    'properties': {
        'Entries' : {
            'type' : 'array',
            'items' : item_schema,
        },
    },
    'required': [
        'Entries'
    ],
}

export const inventory_schema = {
    'type': 'object',
    'properties' : {
        'Barcode': {
            'type' : 'string',
            'default': ''
        },
        'Name': {
            'type' : 'string',
            'default': ''
        },
        'Quantity': {
            'type' : 'integer',
            'default' : 0
            
        },
        'Catalog': {
            'type': 'string',
            'default': ''
        }
    },
    'required': [
        'Name', 'Quantity',
    ]
}

export const inventory_list_schema = {
    'type': 'object',
    'properties': {
        'Entries' : {
            'type' : 'array',
            'items' : inventory_schema,
        },
    },
    'required': [
        'Entries'
    ],
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
        'Entries' : {
            'type' : 'array',
            'items' : project_schema,
        }
    },
    'required': [
        'Entries'
    ],
}