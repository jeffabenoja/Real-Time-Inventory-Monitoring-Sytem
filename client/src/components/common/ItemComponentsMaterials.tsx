import { useState } from "react"
import { FaChevronUp, FaChevronDown } from "react-icons/fa"
import { ItemType } from "../../type/itemType"
import { IoMdClose } from "react-icons/io"
interface MaterialType {
  code: string
  qty: number
  unit: string
}

interface ItemComponentsMaterialsProps {
  productList: ItemType[]
}

const ItemComponentsMaterials: React.FC<ItemComponentsMaterialsProps> = ({
  productList,
}) => {
  const [dropDownIndex, setDropDownIndex] = useState<number | null>(null)
  const [materials, setMaterials] = useState<MaterialType[]>([
    { code: "", qty: 0, unit: "" },
  ])

  const handleDeleteMaterial = (index: number) => {
    if (materials.length > 1) {
      const updatedMaterials = materials.filter(
        (_: MaterialType, matIndex: number) => matIndex !== index
      )
      setMaterials(updatedMaterials)
    }
  }

  const handleDropDown = (index: number, productCode: string) => {
    const updatedMaterials = materials.map((material: any, i: number) =>
      i === index ? { ...material, code: productCode } : material
    )
    setMaterials(updatedMaterials)
    setDropDownIndex(null)
  }

  const handleInputChange = (
    index: number,
    field: "qty" | "unit",
    value: string | number
  ) => {
    const updatedMaterials = materials.map((material: any, i: number) =>
      i === index ? { ...material, [field]: value } : material
    )
    setMaterials(updatedMaterials)
  }

  return (
    <>
      <div className='flex flex-col gap-2'>
        <p>Item Materials</p>
        {materials.map((material: any, index: number) => (
          <div className='flex gap-1' key={index}>
            <div className='flex-1 py-2 px-4 border border-opacity-25 rounded-md outline-transparent bg-transparent'>
              <div
                className={`flex items-center justify-between w-full cursor-pointer ${
                  dropDownIndex === index
                    ? "border-b border-opacity-25 border-primary"
                    : ""
                }`}
              >
                <span className='text-black'>
                  {material.code === "" ? "Material Code" : material.code}
                </span>

                <div
                  onClick={() =>
                    setDropDownIndex(dropDownIndex === index ? null : index)
                  }
                >
                  {dropDownIndex === index ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </div>
              </div>
              {/* DropDown */}
              {dropDownIndex === index && (
                <div
                  onClick={() => setDropDownIndex(null)}
                  className='shadow-md border mt-3 border-opacity-25 outline-transparent overflow-y-auto rounded-lg py-3 md:py-4 text-secondary-200 bg-white w-full h-[100px]'
                >
                  {productList?.map((product: ItemType) => (
                    <div
                      key={product.code}
                      onClick={() => handleDropDown(index, product.code)}
                      className='px-4 py-2 cursor-pointer hover:text-[#112F1B]'
                    >
                      {product.code}
                    </div>
                  ))}
                </div>
              )}
              <div className='flex justify-between items-center mt-3'>
                <div className='flex flex-col gap-2'>
                  <label htmlFor={`quantity-${index}`} className='text-sm'>
                    Quantity
                  </label>
                  <input
                    type='number'
                    step='1'
                    min='1'
                    id={`quantity-${index}`}
                    autoComplete='off'
                    name='quantity'
                    value={material.qty}
                    onChange={(e) =>
                      handleInputChange(index, "qty", parseInt(e.target.value))
                    }
                    className='w-[100px] md:w-[150px] py-1 pl-4 pr-1 border border-secondary-200 border-opacity-25 rounded-md outline-transparent bg-transparent focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary'
                  />
                </div>

                <div className='flex flex-col gap-2'>
                  <label htmlFor={`unit-${index}`} className='text-sm'>
                    Unit
                  </label>
                  <input
                    type='text'
                    id={`unit-${index}`}
                    name='unit'
                    autoComplete='off'
                    value={material.unit}
                    onChange={(e) =>
                      handleInputChange(index, "unit", e.target.value)
                    }
                    className='w-[100px] md:w-[150px] py-1 lowercase px-4 border border-secondary-200 border-opacity-25 rounded-md outline-transparent bg-transparent focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary'
                  />
                </div>
              </div>
            </div>

            <IoMdClose
              className='cursor-pointer'
              size={20}
              onClick={() => handleDeleteMaterial(index)}
            />
          </div>
        ))}
      </div>

      <button
        onClick={() =>
          setMaterials([...materials, { code: "", qty: 0, unit: "" }])
        }
        type='button'
        className='bg-gray-200 rounded-[20px] py-2 mt-4'
      >
        <p className='text-black'>+ Add Material Item</p>
      </button>
    </>
  )
}

export default ItemComponentsMaterials
