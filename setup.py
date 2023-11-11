from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in online_ticket_booking/__init__.py
from online_ticket_booking import __version__ as version

setup(
	name="online_ticket_booking",
	version=version,
	description="Ticket booking App",
	author="ad",
	author_email="ad@gmail.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
