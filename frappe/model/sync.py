# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# MIT License. See license.txt

from __future__ import unicode_literals
"""
	Sync's doctype and docfields from txt files to database
	perms will get synced only if none exist
"""
import frappe
import os
from frappe.modules.import_file import import_file_by_path
from frappe.modules.patch_handler import block_user
from frappe.utils import update_progress_bar

def sync_all(force=0, verbose=False):
	block_user(True)

	for app in frappe.get_installed_apps():
	    #if app=='church_ministry':
	    #	print "in chuch"
	    #else:
		sync_for(app, force, verbose=verbose)

	block_user(False)

	frappe.clear_cache()

def sync_for(app_name, force=0, sync_everything = False, verbose=False):
	files = []

	if app_name == "frappe":
		# these need to go first at time of install
		for d in (("core", "docfield"), ("core", "docperm"), ("core", "doctype"),
			("core", "user"), ("core", "role"), ("custom", "custom_field"),
			("custom", "property_setter")):
			files.append(os.path.join(frappe.get_app_path("frappe"), d[0],
				"doctype", d[1], d[1] + ".json"))

	for module_name in frappe.local.app_modules.get(app_name) or []:
		folder = os.path.dirname(frappe.get_module(app_name + "." + module_name).__file__)
		get_doc_files(files, folder, force, sync_everything, verbose=verbose)

	l = len(files)
	if l:
		for i, doc_path in enumerate(files):
			import_file_by_path(doc_path, force=force)
			#print module_name + ' | ' + doctype + ' | ' + name

			frappe.db.commit()

			# show progress bar
			update_progress_bar("Updating {0}".format(app_name), i, l)

		print ""


def get_doc_files(files, start_path, force=0, sync_everything = False, verbose=False):
	"""walk and sync all doctypes and pages"""

	document_type = ['doctype', 'page', 'report', 'print_format', 'website_theme']
	for doctype in document_type:
		doctype_path = os.path.join(start_path, doctype)
		if os.path.exists(doctype_path):

			for docname in os.listdir(doctype_path):
				if os.path.isdir(os.path.join(doctype_path, docname)):
					doc_path = os.path.join(doctype_path, docname, docname) + ".json"
					if os.path.exists(doc_path):
						if not doc_path in files:
							files.append(doc_path)
