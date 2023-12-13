'use client'
import { api } from '@/api/api'
import { Api } from '@/inteface/IApi'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { FiTrash } from 'react-icons/fi'

export default function Home() {
  const [customer, setCustomer] = useState<Api[]>([])
  const nameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    loadCustomer()
  }, [])

  async function loadCustomer() {
    const resposne = await api.get("/clientes")
    setCustomer(resposne.data)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!nameRef.current?.value || !emailRef.current?.value) return

    const response = await api.post("/clientes", {
      name: nameRef.current?.value,
      email: emailRef.current?.value,
    })

    setCustomer(allCustomer => [...allCustomer, response.data])
    nameRef.current.value = ""
    emailRef.current.value = ""
  }

  async function handleDelete(id: string) {
    try {
      await api.delete("/clientes", {
        params: {
          id: id,
        }
      })

      setCustomer(customer.filter(customer => customer.id !== id))
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="m-auto bg-gray-50 overflow-y-scroll lg:w-[450px] w-[330px] h-[580px] mt-12 rounded-md">
      <div>
        <div className="text-center pt-5">
          <h1 className="text-4xl">Clientes</h1>
        </div>

        <form className="flex flex-col lg:ml-20 ml-8 mt-12" onSubmit={handleSubmit}>
          <label>Nome:</label>
          <input type="text"
            placeholder="Digite seu Nome...."
            className="focus:outline-none lg:w-72 w-64 mt-2 p-4 rounded-md bg-gray-100 focus:bg-gray-200"
            ref={nameRef}
          />

          <label className="mt-6">Email:</label>
          <input type="text"
            placeholder="Digite seu email...."
            className="focus:outline-none lg:w-72 w-64 mt-2 p-4 rounded-md bg-gray-100 focus:bg-gray-200"
            ref={emailRef}
          />

          <input type="submit" value="Cadastrar"
            className="lg:w-72 w-64 bg-gray-200 p-4 rounded-md mt-10 cursor-pointer" />
        </form>
        <div>
          <ul>
            {customer.map(({ id, name, email }) => (
              <li key={id} className="lg:ml-20 ml-8 mt-12 relative mb-4 bg-gray-100 w-72 rounded-md p-4">
                <p>Nome: <span>{name}</span></p>
                <p>Email: <span>{email}</span></p>
                <button className='absolute top-2 right-4' onClick={() => handleDelete(id)} >
                  <FiTrash size={20} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
