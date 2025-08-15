export const InfoTab = () => {

    return (
        <div>
            <div className="border border-1 border-secondary rounded">
                <div className="row">
                    <div className="col-6">
                        <div>
                            <div class="input-group mb-3">
                                <span class="input-group-text" id="changemeid1">First Name</span>
                                <input type="text" class="form-control" placeholder="PlcHld First" aria-label="changemela1" aria-describedby="changemeid1" />
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text" id="changemeid2">Last Name</span>
                                <input type="text" class="form-control" placeholder="PlHld Last" aria-label="changemela2" aria-describedby="changemeid2" />
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div>
                            <div class="input-group mb-3">
                                <span class="input-group-text" id="changemeid3">E-Mail</span>
                                <input type="text" class="form-control" placeholder="PlcHld Mail" aria-label="changemela3" aria-describedby="changemeid3" />
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text" id="changemeid4">Phone #</span>
                                <input type="text" class="form-control" placeholder="PlHld Phone" aria-label="changemela4" aria-describedby="changemeid4" />
                            </div>
                        </div>
                    </div>
                    <div className="d-flex">
                    <div className="ms-auto">
                        <button className="btn btn-secondary">Cancel</button>
                        <button className="btn btn-gold ms-2 me-5">Save</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InfoTab