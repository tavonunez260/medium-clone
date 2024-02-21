import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export function Header() {
	return (
		<header>
			<Disclosure as="nav" className="bg-white shadow">
				{({ open }) => (
					<>
						<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
							<div className="flex h-16 justify-between">
								<div className="flex">
									<div className="flex flex-shrink-0 items-center">
										<Link href="/">
											<img
												alt="Medium Logo"
												className="h-8 w-auto"
												src="https://links.papareact.com/yvf"
											/>
										</Link>
									</div>
									<div className="hidden md:ml-6 md:flex md:space-x-8">
										<a
											className="inline-flex items-center border-b-2 border-black px-1 pt-1 text-sm font-medium text-gray-900"
											href="#"
										>
											About
										</a>
										<a
											className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
											href="#"
										>
											Contact
										</a>
										<a
											className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
											href="#"
										>
											Follow
										</a>
									</div>
								</div>
								<div className="flex">
									<div className="hidden md:ml-6 md:flex md:space-x-8">
										<a
											className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
											href="#"
										>
											Sign in <ArrowRightIcon className="ml-2 w-3 h-3 text-black" />
										</a>
										<a
											className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
											href="#"
										>
											Get started
										</a>
									</div>
								</div>
								<div className="-mr-2 flex items-center md:hidden">
									{/* Mobile menu button */}
									<Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black">
										<span className="absolute -inset-0.5" />
										<span className="sr-only">Open main menu</span>
										{open ? (
											<XMarkIcon aria-hidden="true" className="block h-6 w-6" />
										) : (
											<Bars3Icon aria-hidden="true" className="block h-6 w-6" />
										)}
									</Disclosure.Button>
								</div>
							</div>
						</div>

						<Disclosure.Panel className="md:hidden">
							<div className="space-y-1 pb-3 pt-2">
								<Disclosure.Button
									as="a"
									className="block border-l-4 border-black bg-gray-100 py-2 pl-3 pr-4 text-base font-medium text-black"
									href="#"
								>
									About
								</Disclosure.Button>
								<Disclosure.Button
									as="a"
									className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
									href="#"
								>
									Contact
								</Disclosure.Button>
								<Disclosure.Button
									as="a"
									className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
									href="#"
								>
									Follow
								</Disclosure.Button>
							</div>
							<div className="border-t border-gray-200 pb-3 pt-4">
								<div className="space-y-1">
									<Disclosure.Button
										as="a"
										className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
										href="#"
									>
										Sign In
									</Disclosure.Button>
									<Disclosure.Button
										as="a"
										className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
										href="#"
									>
										Get Started
									</Disclosure.Button>
								</div>
							</div>
						</Disclosure.Panel>
					</>
				)}
			</Disclosure>
		</header>
	);
}
