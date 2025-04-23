import React from "react";
import ButtonIcon from "../reusables/buttonIcon";
import Paginator from "../reusables/paginator";
import TripCreatorPage from "./tripCreator";
import SiteList from "./siteList/siteList";

export default function NewTripCreatorPage() {

    return (
        <Paginator>
            <Paginator.Screens>
                <TripCreatorPage />
                <SiteList/>
            </Paginator.Screens>

            <Paginator.Buttons>
                <ButtonIcon size="icon" icon="diving-scuba-flag" title="Tip Details" />
                <ButtonIcon size="icon" icon="anchor" title="Dive Sites"/>
            </Paginator.Buttons>
        </Paginator>
    )
}