"use client";

import CreateJobForm from "./CreateJobForm";
import Modal from "./Modal";

export default function AddJobButton() {
  return (
    <div>
      <Modal>
        <Modal.Open>
          <p className="flex items-center justify-center gap-2 hover:bg-[#2d2e3e] text-white px-6 py-3 rounded-2xl font-bold  bg-[#2ecc91] transition-all group-hover:shadow-lg active:scale-95 cursor-pointer">
            Create new job offer
          </p>
        </Modal.Open>
        <Modal.Window>
          <CreateJobForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}
