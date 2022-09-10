import { Component, ViewChild,  OnInit } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';

import {HttpService} from './http.service';

export interface UsersData {
  name: string;
  email: string;
  role: string;
  id: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit{
  title = 'intuit-adminui';
  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'action'];
  dataSource:MatTableDataSource<UsersData>;
  apiData:any;
  selection = new SelectionModel<UsersData>(true, []);

 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable,{static:true}) table: MatTable<any>| undefined;

  constructor(public dialog: MatDialog, private api: HttpService) {}

  ngOnInit(): void {
    this.api.getUsers()
    .subscribe((data:any) => {
      this.dataSource = new MatTableDataSource(data);
      this.apiData = data;
      this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    } );
    
  }

  

  openDialog(action: any,obj:any) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '250px',
      data:obj
    });

    dialogRef.afterClosed().subscribe(result => {
       if(result.event == 'Update'){
        this.updateRowData(result.data);
      }else if(result.event == 'Delete'){
        this.deleteRowData(result.data);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  
  updateRowData(row_obj){
    this.dataSource.data = this.dataSource.data.filter((value,key)=>{
      if(value.id == row_obj.id){
        value.name = row_obj.name;
      }
      return true;
    });
  }
  deleteRowData(row_obj){
   this.dataSource.data = this.dataSource.data.filter((item, index) => item.id !== row_obj.id);
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

}
