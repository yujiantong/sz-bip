package com.bofide.bip.exception;

public class InsuranceBillImportException extends Exception {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -3644981371980437060L;
	private int rowNumber;
	
	public InsuranceBillImportException(String msg, int rowNumber){
		super(msg);
		this.rowNumber = rowNumber;
	}

	public int getRowNumber() {
		return rowNumber;
	}

	public void setRowNumber(int rowNumber) {
		this.rowNumber = rowNumber;
	}

}
