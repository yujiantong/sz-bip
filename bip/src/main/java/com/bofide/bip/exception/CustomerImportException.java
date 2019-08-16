package com.bofide.bip.exception;

public class CustomerImportException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 2286257866676794423L;
	private int rowNumber;
	public CustomerImportException(String msg,int rowNumber){
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
