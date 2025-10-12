import React from 'react';
import { getDocsNavTree } from "@/lib/getDocsNavTree";
import Sidebar from './SideBar';

const SideBarWrapper = () => {
    const navTree = getDocsNavTree();
    return <Sidebar tree={navTree} />
}

export default SideBarWrapper