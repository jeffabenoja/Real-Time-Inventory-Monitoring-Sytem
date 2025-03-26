// ConfirmationModal.test.tsx
import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import ConfirmationModal from "./ConfirmationModal";

describe("ConfirmationModal", () => {
  it("renders confirmation text", () => {
    render(
      <ConfirmationModal>
        <button>Yes</button>
        <button>No</button>
      </ConfirmationModal>
    );
  });
});
