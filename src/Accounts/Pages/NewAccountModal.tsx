import { useState } from "react";
import Button from "../../Accounts/Components/Button";
// import CirclePlus from "../../assets/circle-plus.svg";
import CashImage from "../../assets/images/CashImage.png";
import bgImage from "../../assets/images/Frame 6.png";
import chartOfAcc from "../../assets/constants/chartOfAcc";
import Modal from "../../Accounts/Components/Modal";
import CehvronDown from "../../assets/icons/cheveronDown";

interface NewAccountModalProps {
  fetchAllAccounts: () => void;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function NewAccountModal({ isModalOpen, setIsModalOpen, fetchAllAccounts }: NewAccountModalProps) {
  const [openingType, setOpeningType] = useState("Debit"); 
  const [formValues, setFormValues] = useState({
    accountName: "",
    accountCode: "",
    accountSubhead: "",
    description: "",
    debitOpeningBalance: "",
    creditOpeningBalance: "",
  });

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "openingType") {
      setOpeningType(value);
    } else {
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to handle form submission (creating new account)
    // This will involve calling a backend API or passing data to the parent component
    fetchAllAccounts();
    closeModal();
  };

  return (
    <div>
      <Modal open={isModalOpen} onClose={closeModal} className="w-[68%]">
        <div className="p-5 mt-3">
          <div className="mb-5 flex p-4 rounded-xl bg-CreamBg relative overflow-hidden">
            <div
              className="absolute top-0 right-16 w-[178px] h-[89px]"
              style={{ backgroundImage: `url(${bgImage})` }}
            ></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-textColor">Create Account</h3>
              <p className="text-dropdownText font-semibold text-sm mt-2">
                Start your journey with us—create your account in moments!
              </p>
            </div>
            <div
              className="ms-auto text-3xl cursor-pointer relative z-10"
              onClick={closeModal}
            >
              &times;
            </div>
          </div>

          <form className="flex justify-between" onSubmit={handleSubmit}>
            <div>
              <img src={CashImage} alt="Cash" />
            </div>
            <div className="w-[65%]">
              <div className="mb-4">
                <label className="block text-sm text-labelColor mb-1">
                  Account Type
                </label>
                <select
                  name="accountSubhead"
                  value={formValues.accountSubhead}
                  onChange={handleChange}
                  className="w-full border border-inputBorder rounded p-1.5 pl-2 text-sm"
                >
                  <option disabled hidden value="">
                    Select type
                  </option>
                  {chartOfAcc.map((item, index) => (
                    <optgroup
                      className="text-maroon"
                      key={index}
                      label={item.head}
                    >
                      {item.subhead.map((subitem, subindex) => (
                        <option
                          className="text-black option-spacing"
                          key={subindex}
                          value={subitem}
                        >
                          {subitem}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1 text-labelColor">
                  Account Name
                </label>
                <input
                  type="text"
                  name="accountName"
                  value={formValues.accountName}
                  onChange={handleChange}
                  placeholder="Enter Account Name"
                  className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-labelColor text-sm">
                  Opening Balance
                </label>
                <div className="flex">
                  <div className="relative w-20 ">
                    <select
                      className="block appearance-none w-full h-9 text-[#818894] bg-white border border-inputBorder 
                                   text-sm pl-2 pr-2 rounded-l-md leading-tight 
                                   focus:outline-none focus:bg-white focus:border-gray-500"
                      name="openingType"
                      value={openingType}
                      onChange={handleChange}
                    >
                      <option value="Debit">Dr</option>
                      <option value="Credit">Cr</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  </div>
                  <input
                    type="text"
                    className="text-sm w-[100%] rounded-r-md text-start bg-white border border-slate-300 h-9 p-2"
                    placeholder="Enter Opening Balance"
                    name="openingBalance"
                    value={
                      openingType === "Debit"
                        ? formValues.debitOpeningBalance
                        : formValues.creditOpeningBalance
                    }
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1 text-labelColor">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formValues.description}
                  onChange={handleChange}
                  placeholder="Enter Description"
                  className="border-inputBorder w-full text-sm border rounded p-2 pt-5 pl-2"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1 text-labelColor">
                  Account Code
                </label>
                <input
                  type="text"
                  name="accountCode"
                  value={formValues.accountCode}
                  onChange={handleChange}
                  placeholder="Enter Account Code"
                  className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2"
                />
              </div>
              <br />
              <div className="flex justify-end gap-2">
                <Button
                  onClick={closeModal}
                  type="button"
                  variant="secondary"
                  className="rounded"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="rounded">
                  Add Account
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default NewAccountModal;
