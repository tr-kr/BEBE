module.exports = {
    HTML: function () {
        return `
        <!doctype html>
        <html>
        <head>
          <title>tr.kr</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">TR.KR</a></h1>

          <form method="post" action="/api/competition" enctype="multipart/form-data">
            <p>
              <textarea name="competition_title" placeholder="title"></textarea>
            </p>
            <p>
              <textarea name="competition_content" placeholder="competition_content"></textarea>
            </p>
            <p>
              <textarea name="pre_date" placeholder="예선날짜"></textarea>
            </p>
            <p>
              <textarea name="final_date" placeholder="본선날짜"></textarea>
            </p>
            <p>
            <textarea name="dead_date" placeholder="마감날짜"></textarea>
            </p>
            <p>
            <textarea name="qualification" placeholder="참가자격"></textarea>
            </p>
            <p>
           <textarea name="prize" placeholder="보상"></textarea>
           </p>
            <p>
            <textarea name="event" placeholder="종목"></textarea>
          </p>
            <table>
            <tr>
                <td><label>파일</label></td>
                <td><input type="file" name="photo"></td>
            </tr>
        </table>
            <p>
            <input type="submit" value="업로드" name="submit">
            </p>
    </form>
        </body>
        </html>
        `;
    },
    PAGE: function () {
      return `
      <!doctype html>
      <html>
      <head>
        <title>tr.kr</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">TR.KR</a></h1>
        <form method="post" action="/competition" enctype="multipart/form-data">
          <p>
            <textarea name="competition_title" placeholder="title"></textarea>
          </p>
          <p>
            <textarea name="competition_content" placeholder="competition_content"></textarea>
          </p>
          <p>
            <textarea name="pre_date" placeholder="예선날짜"></textarea>
          </p>
          <p>
            <textarea name="final_date" placeholder="본선날짜"></textarea>
          </p>
          <p>
          <textarea name="dead_date" placeholder="마감날짜"></textarea>
          </p>
          <p>
          <textarea name="qualification" placeholder="참가자격"></textarea>
          </p>
          <p>
         <textarea name="prize" placeholder="보상"></textarea>
         </p>
          <p>
          <textarea name="event" placeholder="종목"></textarea>
        </p>
          <table>
          <tr>
              <td><label>파일</label></td>
              <td><input type="file" name="photo"></td>
          </tr>
      </table>
          <p>
          <input type="submit" value="업로드" name="submit">
          </p>
  </form>
      </body>
      </html>
      `;
  },
    list: function (filelist) {
      var list = '<ul>';
      var i = 0;
      while (i < filelist.length) {
        list = list + `<li><a href="/competition/${filelist[i]}">${filelist[i]}</a></li>`;
        i = i + 1;
      }
      list = list + '</ul>';
      return list;
    }

};
  

  /*
,
   
  */