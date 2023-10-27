import CreateSpot from "./index";

const CreateSpotForm = () => {

   const spot = {
        ownerId: '',
        address: '',
        country: '',
        city: '',
        lat: '',
        lng: '',
        state: '',
        description: '',
        name: '',
        price: '',
        previewImage: ''
    };

    return (
        <>
            <CreateSpot spot={spot} formType="Create Form" />
        </>
    )
}

export default CreateSpotForm;
