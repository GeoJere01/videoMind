"use client";

import SchematicComponent from "../components/schematic/SchematicComponent";

function ManagePlanPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 my-8">Manage your plan</h1>
      <p className="text-gray-600 mb-8">
        Manage your subscription and billing details here.
      </p>

      <SchematicComponent componentId="cmpn_L2buHM4LCp3" />
    </div>
  );
}

export default ManagePlanPage;
