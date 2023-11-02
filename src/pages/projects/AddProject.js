import { React } from "react"
import Form from "@rjsf/core";
import { customizeValidator } from "@rjsf/validator-ajv8";
import './AddProject.css'
import { api_url } from "../../resources/constants";
import { useMutate, Methods } from "../../util/QueryHandler";
import { project_schema } from "../../resources/schemas";

function AddProject({ changeAdding }) {
    const validator = customizeValidator()
    const addProject = useMutate(
        String(api_url) + `/add_project`,
        Methods.Post,
        ['project'],
        // Data population function, called in query handler
        ((data) => {
            console.log(data)
            changeAdding()
        })
    )

    function onSubmit({ formData }, e) {
        e.preventDefault()
        addProject.mutate(formData)
    }

    if(addProject.isLoading) {
        // If Loading:
        return (
            <div>
                Loading
            </div>
        )
    } else if (addProject.isError) {
        // If Error Occurred:
        return (
            <div>
                {addProject.error.message}
            </div>
        )
    } else {
        return (
            <div className="add-project-wrapper">
                <Form schema={project_schema} validator={validator} onSubmit={onSubmit} />
            </div>
        )
    }
}

export default AddProject