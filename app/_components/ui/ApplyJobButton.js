"use client";

import { Modal } from "../shared";
import { ApplyJobForm } from "../user";

export default function ApplyJobButton({ accountInfo, jobId }) {
  return (
    <div>
      <Modal>
        <Modal.Open>
          <button className="bg-primary-400 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-primary-600 transition-all shadow-lg mx-auto cursor-pointer  ">
            Apply
          </button>
        </Modal.Open>
        <Modal.Window>
          <ApplyJobForm accountInfo={accountInfo} jobId={jobId} />
        </Modal.Window>
      </Modal>
    </div>
  );
}
