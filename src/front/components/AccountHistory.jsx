export const HistoryTab = () => {

    return (
        <div className="d-flex align-items-center justify-content-center">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Customer Email</th>
                        <th scope="col">Technician</th>
                        <th scope="col">Package</th>
                        <th scope="col">Price (Tip)</th>
                        <th scope="col">Date</th>
                        <th scope="col">Time</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>Mark Hamill</td>
                        <td>markham@gmail.com</td>
                        <td>Bryan Chau</td>
                        <td>Gel Manicure</td>
                        <td>$40 ($12)</td>
                        <td>9/12/2025</td>
                        <td>12:00 PM</td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td>Hayden Christensen</td>
                        <td>chozen1@gmail.com</td>
                        <td>Sophia Rivera</td>
                        <td>Deluxe Pedicure</td>
                        <td>$60 ($20)</td>
                        <td>9/14/2025</td>
                        <td>1:00 PM</td>
                    </tr>
                    <tr>
                        <th scope="row">3</th>
                        <td>Ewan McGregor</td>
                        <td>masterdefense@gmail.com</td>
                        <td>Jin Park</td>
                        <td>Acrylic Fill</td>
                        <td>$25 ($20)</td>
                        <td>9/15/2025</td>
                        <td>3:00 PM</td>
                    </tr>
                    <tr>
                        <th scope="row">4</th>
                        <td>James Earl Jones</td>
                        <td>urfather@gmail.com</td>
                        <td>Noah Kim</td>
                        <td>Multichrome Dip</td>
                        <td>$50 ($0)</td>
                        <td>9/20/2025</td>
                        <td>3:00 PM</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default HistoryTab