import { Suspense } from "react";
import AddNewUserPage from "./user";

export default function User() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <AddNewUserPage />
    </Suspense>
  );
}